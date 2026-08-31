import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Editor {
  id: number;
  name: string;
  email: string;
  status: string;
}

@Component({
  selector: 'app-editors',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './editors.html',
  styleUrl: './editors.css'
})
export class Editors implements OnInit {

  editors: Editor[] = [];

  loading = false;

  message = '';
  errorMessage = '';

  showForm = false;
  isEditing = false;

  selectedEditorId: number | null = null;

  name = '';
  email = '';
  password = '';


  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef

  ) {}


  // ==================================================
  // INITIAL LOAD
  // ==================================================

  ngOnInit(): void {

    this.loadEditors();

  }


  // ==================================================
  // GET EDITORS
  // ==================================================

  loadEditors(): void {

    this.loading = true;

    this.message = '';
    this.errorMessage = '';

    const token =
      localStorage.getItem('token');

    const headers =
      new HttpHeaders({
        Authorization:
          `Bearer ${token}`
      });


    this.http.get<any>(
      'http://localhost:3000/admin/editors',
      { headers }
    ).subscribe({

      next: (response) => {

        this.editors =
          response.editors || [];

        this.loading = false;
        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'Failed to load editors:',
          error
        );

        this.loading = false;

        this.errorMessage =
          error.error?.message ||
          'Failed to load editors.';

      }

    });

  }


  // ==================================================
  // OPEN ADD FORM
  // ==================================================

  openAddForm(): void {

    this.resetForm();

    this.isEditing = false;

    this.showForm = true;

  }


  // ==================================================
  // OPEN EDIT FORM
  // ==================================================

  openEditForm(editor: Editor): void {

    this.isEditing = true;

    this.showForm = true;

    this.selectedEditorId =
      editor.id;

    this.name =
      editor.name;

    this.email =
      editor.email;

    this.password = '';

    this.message = '';
    this.errorMessage = '';

  }


  // ==================================================
  // SAVE EDITOR
  // ==================================================

  saveEditor(): void {

    this.message = '';
    this.errorMessage = '';


    if (
      !this.name.trim() ||
      !this.email.trim()
    ) {

      this.errorMessage =
        'Name and email are required.';

      return;

    }


    if (
      !this.isEditing &&
      !this.password.trim()
    ) {

      this.errorMessage =
        'Password is required for a new editor.';

      return;

    }


    const token =
      localStorage.getItem('token');

    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`,

        'Content-Type':
          'application/json'

      });


    const editorData: any = {

      name:
        this.name.trim(),

      email:
        this.email.trim()

    };


    if (this.password.trim()) {

      editorData.password =
        this.password.trim();

    }


    this.loading = true;


    // ==================================================
    // EDIT
    // ==================================================

    if (
      this.isEditing &&
      this.selectedEditorId !== null
    ) {

      this.http.put<any>(
        `http://localhost:3000/admin/editors/${this.selectedEditorId}`,
        editorData,
        { headers }
      ).subscribe({

        next: (response) => {

    this.message =
        response.message ||
        'Editor updated successfully.';

    this.loading = false;

    this.showForm = false;

    // Update the editor directly in the local list
    const index = this.editors.findIndex(
        editor => editor.id === this.selectedEditorId
    );

    if (index !== -1) {

        this.editors[index] = {
            ...this.editors[index],
            name: this.name.trim(),
            email: this.email.trim()
        };

    }

    this.resetForm();

    this.cdr.detectChanges();

},

        error: (error) => {

          console.error(
            'Update editor failed:',
            error
          );

          this.loading = false;

          this.errorMessage =
            error.error?.message ||
            'Failed to update editor.';

        }

      });

      return;

    }


    // ==================================================
    // ADD
    // ==================================================

    this.http.post<any>(
      'http://localhost:3000/admin/editors',
      editorData,
      { headers }
    ).subscribe({

      next: (response) => {

    this.message =
        response.message ||
        'Editor created successfully.';

    this.loading = false;

    this.showForm = false;

    // Add the newly created editor directly
    if (response.editor) {

        this.editors.push(response.editor);

    } else {

        // Fallback if backend doesn't return the editor
        this.loadEditors();

    }

    this.resetForm();

    this.cdr.detectChanges();

},

      error: (error) => {

        console.error(
          'Create editor failed:',
          error
        );

        this.loading = false;

        this.errorMessage =
          error.error?.message ||
          'Failed to create editor.';

      }

    });

  }


  // ==================================================
  // ACTIVATE / DEACTIVATE
  // ==================================================

  toggleStatus(editor: Editor): void {

    const newStatus =
      editor.status?.toLowerCase() === 'active'
        ? 'inactive'
        : 'active';


    const action =
      newStatus === 'active'
        ? 'activate'
        : 'deactivate';


    if (
      !confirm(
        `Are you sure you want to ${action} ${editor.name}?`
      )
    ) {

      return;

    }


    const token =
      localStorage.getItem('token');

    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`,

        'Content-Type':
          'application/json'

      });


    this.http.put<any>(
      `http://localhost:3000/admin/editors/${editor.id}/status`,
      {
        status: newStatus
      },
      { headers }
    ).subscribe({

      next: (response) => {

    this.message =
        response.message ||
        'Editor status updated.';

    // Immediately update the editor in the table
    editor.status = newStatus;

    this.cdr.detectChanges();

},

      error: (error) => {

        console.error(
          'Status update failed:',
          error
        );

        this.errorMessage =
          error.error?.message ||
          'Failed to update editor status.';


        this.message = '';

        this.cdr.detectChanges();

      }

    });

  }


  // ==================================================
  // DELETE EDITOR
  // ==================================================

  deleteEditor(editor: Editor): void {

    if (
      !confirm(
        `Are you sure you want to permanently delete ${editor.name}?`
      )
    ) {

      return;

    }


    const token =
      localStorage.getItem('token');

    const headers =
      new HttpHeaders({

        Authorization:
          `Bearer ${token}`

      });


    this.http.delete<any>(
      `http://localhost:3000/admin/editors/${editor.id}`,
      { headers }
    ).subscribe({

      next: (response) => {

    this.message =
        response.message ||
        'Editor deleted successfully.';

    this.editors =
        this.editors.filter(
            e => e.id !== editor.id
        );

    this.cdr.detectChanges();

},

      error: (error) => {

        console.error(
          'Delete editor failed:',
          error
        );

        this.errorMessage =
          error.error?.message ||
          'Failed to delete editor.';

      }

    });

  }

  // ==================================================
// EXPORT EDITORS PDF
// ==================================================

async exportEditorsPDF(): Promise<void> {

  const doc = new jsPDF('p', 'mm', 'a4');

  // ==========================
  // COLORS
  // ==========================

  const navy: [number, number, number] = [35, 63, 125];
const teal: [number, number, number] = [20, 137, 137];
const green: [number, number, number] = [0, 160, 70];
const red: [number, number, number] = [220, 40, 40];

  // ==========================
  // LOAD LOGO
  // ==========================

  const logo = await this.loadImage(
    'zip_zip_info_logo.png'
  );

  // ==========================
  // HEADER
  // ==========================

  if (logo) {

    doc.addImage(
      logo,
      'PNG',
      92,
      12,
      26,
      26
    );

  }

  // ZIP ZIP INFO

  doc.setFont(
    'helvetica',
    'bold'
  );

  doc.setFontSize(16);

  doc.setTextColor(
    navy[0],
    navy[1],
    navy[2]
  );

  doc.text(
    'ZIP ZIP INFO',
    105,
    47,
    {
      align: 'center'
    }
  );

  // Newsletter Management System

  doc.setFont(
    'helvetica',
    'normal'
  );

  doc.setFontSize(10);

  doc.setTextColor(
    60,
    60,
    60
  );

  doc.text(
    'Newsletter Management System',
    105,
    55,
    {
      align: 'center'
    }
  );

  // ==========================
  // REPORT TITLE
  // ==========================

  doc.setDrawColor(
    teal[0],
    teal[1],
    teal[2]
  );

  doc.setLineWidth(1);

  doc.line(
    65,
    62,
    90,
    62
  );

  doc.line(
    120,
    62,
    145,
    62
  );

  doc.setFont(
    'helvetica',
    'bold'
  );

  doc.setFontSize(20);

  doc.setTextColor(
    teal[0],
    teal[1],
    teal[2]
  );

  doc.text(
    'EDITOR REPORT',
    105,
    70,
    {
      align: 'center'
    }
  );

  // ==========================
  // MAIN DIVIDER
  // ==========================

  doc.setDrawColor(
    navy[0],
    navy[1],
    navy[2]
  );

  doc.setLineWidth(0.8);

  doc.line(
    20,
    78,
    190,
    78
  );

  // ==========================
  // GENERATED DATE
  // ==========================

  const generatedDate =
    new Date().toLocaleString(
      'en-GB',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    );

  doc.setFont(
    'helvetica',
    'normal'
  );

  doc.setFontSize(10);

  doc.setTextColor(
    50,
    50,
    50
  );

  doc.text(
    `Generated On: ${generatedDate}`,
    20,
    88
  );

  // ==========================
  // STATISTICS
  // ==========================

  const totalEditors =
    this.editors.length;

  const activeEditors =
    this.editors.filter(
      editor =>
        editor.status?.toLowerCase() === 'active'
    ).length;

  const inactiveEditors =
    this.editors.filter(
      editor =>
        editor.status?.toLowerCase() === 'inactive'
    ).length;

  // ==========================
  // STAT CARD FUNCTION
  // ==========================

  const drawCard = (
    x: number,
    title: string,
    value: number,
    background: number[],
    textColor: number[]
  ) => {

    doc.setFillColor(
      background[0],
      background[1],
      background[2]
    );

    doc.roundedRect(
      x,
      95,
      55,
      27,
      5,
      5,
      'F'
    );

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(9);

    doc.setTextColor(
      textColor[0],
      textColor[1],
      textColor[2]
    );

    doc.text(
      title,
      x + 27.5,
      105,
      {
        align: 'center'
      }
    );

    doc.setFontSize(16);

    doc.text(
      String(value),
      x + 27.5,
      115,
      {
        align: 'center'
      }
    );

  };

  // Total

  drawCard(
    20,
    'TOTAL EDITORS',
    totalEditors,
    [225, 238, 250],
    navy
  );

  // Active

  drawCard(
    77.5,
    'ACTIVE',
    activeEditors,
    [225, 245, 232],
    green
  );

  // Inactive

  drawCard(
    135,
    'INACTIVE',
    inactiveEditors,
    [250, 230, 230],
    red
  );

  // ==========================
  // TABLE DATA
  // ==========================

  const tableData =
    this.editors.map(editor => [

      editor.id,

      editor.name,

      editor.email,

      editor.status

    ]);

  // ==========================
  // EDITOR TABLE
  // ==========================

  autoTable(doc, {

    startY: 130,

    head: [[
      'ID',
      'Name',
      'Email',
      'Status'
    ]],

    body: tableData,

    theme: 'grid',

    styles: {

      font: 'helvetica',

      fontSize: 9,

      cellPadding: 4,

      textColor: [70, 70, 70],

      valign: 'middle'

    },

    headStyles: {

      fillColor: teal,

      textColor: [255, 255, 255],

      fontStyle: 'bold',

      halign: 'center'

    },

    columnStyles: {

      0: {
        cellWidth: 18,
        halign: 'center'
      },

      1: {
        cellWidth: 50
      },

      2: {
        cellWidth: 75
      },

      3: {
        cellWidth: 27,
        halign: 'center'
      }

    },

    didParseCell: (data: any) => {

      if (
        data.section === 'body' &&
        data.column.index === 3
      ) {

        const status =
          String(data.cell.raw)
            .toLowerCase();

        if (status === 'active') {

          data.cell.styles.textColor =
            green;

          data.cell.styles.fillColor =
            [225, 245, 232];

          data.cell.styles.fontStyle =
            'bold';

        }

        if (status === 'inactive') {

          data.cell.styles.textColor =
            red;

          data.cell.styles.fillColor =
            [250, 230, 230];

          data.cell.styles.fontStyle =
            'bold';

        }

      }

    },

    didDrawPage: (data: any) => {

      const pageCount =
        doc.getNumberOfPages();

      doc.setFontSize(8);

      doc.setTextColor(
        100,
        100,
        100
      );

      doc.text(
        `ZIP ZIP INFO • Editor Report • Page ${data.pageNumber} of ${pageCount}`,
        105,
        290,
        {
          align: 'center'
        }
      );

    }

  });

  // ==========================
  // SAVE PDF
  // ==========================

  const fileName =
    `ZIP_ZIP_INFO_Editor_Report.pdf`;

  doc.save(fileName);

}


// ==================================================
// LOAD IMAGE
// ==================================================

private loadImage(
  src: string
): Promise<string> {

  return new Promise(
    (resolve) => {

      const img =
        new Image();

      img.onload = () => {

        const canvas =
          document.createElement('canvas');

        canvas.width =
          img.width;

        canvas.height =
          img.height;

        const context =
          canvas.getContext('2d');

        if (!context) {

          resolve('');

          return;

        }

        context.drawImage(
          img,
          0,
          0
        );

        resolve(
          canvas.toDataURL('image/png')
        );

      };

      img.onerror = () => {

        resolve('');

      };

      img.src = src;

    }
  );

}


  // ==================================================
  // CLOSE FORM
  // ==================================================

  closeForm(): void {

    this.showForm = false;

    this.resetForm();

  }


  // ==================================================
  // RESET FORM
  // ==================================================

  resetForm(): void {

    this.selectedEditorId = null;

    this.name = '';

    this.email = '';

    this.password = '';

    this.isEditing = false;

    this.message = '';

    this.errorMessage = '';

  }

}