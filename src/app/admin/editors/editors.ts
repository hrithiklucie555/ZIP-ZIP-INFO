import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

          this.loadEditors();

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

        this.loadEditors();

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

        this.loadEditors();

      },

      error: (error) => {

        console.error(
          'Status update failed:',
          error
        );

        this.errorMessage =
          error.error?.message ||
          'Failed to update editor status.';

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

        this.loadEditors();

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