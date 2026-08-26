import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Subscriber } from '../../models/subscriber';
import { SubscriberService } from '../../services/subscriber.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-subscribers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscribers.html',
  styleUrl: './subscribers.css'
})
export class Subscribers implements OnInit {

  subscribers: Subscriber[] = [];
  filteredSubscribers: Subscriber[] = [];

  search = '';

  selectedSubscriber: Subscriber | null = null;

  deleteSubscriberData: Subscriber | null = null;

  showDeleteModal = false;

  constructor(
    private subscriberService: SubscriberService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadSubscribers();

  }

  loadSubscribers(): void {

    this.subscriberService.getSubscribers().subscribe({

      next: (data: Subscriber[]) => {

        this.subscribers = data;
        this.filteredSubscribers = [...data];
        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Failed to load subscribers', error);

      }

    });

  }

  filterSubscribers(): void {

  const value = this.search.trim();

  // If search box is empty, show all subscribers
  if (!value) {

    this.filteredSubscribers = [...this.subscribers];

    return;

  }

  this.subscriberService.searchSubscribers(value).subscribe({

    next: (data: Subscriber[]) => {

      this.filteredSubscribers = data;

      this.cdr.detectChanges();

    },

    error: (error) => {

      if (error.status === 404) {

        this.filteredSubscribers = [];

      } else {

        console.error(
          'Subscriber search failed:',
          error
        );

      }

      this.cdr.detectChanges();

    }

  });

}

  editSubscriber(subscriber: Subscriber): void {
    // Close delete modal if it is open
  this.showDeleteModal = false;
  this.deleteSubscriberData = null;

  this.selectedSubscriber = { ...subscriber }
  this.cdr.detectChanges();

}

// ==========================
// Activate / Deactivate Subscriber
// ==========================

toggleStatus(subscriber: Subscriber): void {

  const newStatus =
    subscriber.status?.toLowerCase() === 'active'
      ? 'inactive'
      : 'active';

  const action =
    newStatus === 'active'
      ? 'activate'
      : 'deactivate';


  if (
    !confirm(
      `Are you sure you want to ${action} ${subscriber.name}?`
    )
  ) {

    return;

  }


  this.subscriberService.updateSubscriberStatus(
    subscriber.id,
    newStatus
  ).subscribe({

    next: (response) => {

      console.log(
        'Subscriber status updated:',
        response
      );

      this.loadSubscribers();

    },

    error: (error) => {

      console.error(
        'Subscriber status update failed:',
        error
      );

      alert(
        error.error?.message ||
        'Failed to update subscriber status.'
      );

    }

  });

}

  openDeleteModal(subscriber: Subscriber): void {

    // Close the edit modal if it is open
  this.showDeleteModal = true;
  this.selectedSubscriber = null;

  this.deleteSubscriberData = subscriber;


}

confirmDelete(): void {

  if (!this.deleteSubscriberData) {

    return;

  }

  this.subscriberService.deleteSubscriber(
    this.deleteSubscriberData.id
  ).subscribe({

    next: () => {

      this.showDeleteModal = false;

      this.deleteSubscriberData = null;

      this.loadSubscribers();

    },

    error: (error) => {

      console.error('Delete failed', error);

    }

  });

}
exportSubscribers(): void {

  const excelData = this.subscribers.map(subscriber => ({

    ID: subscriber.id,

    Name: subscriber.name,

    Email: subscriber.email,

    Phone: subscriber.phone,

    Joined: new Date(subscriber.subscribedAt).toLocaleDateString()

  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Subscribers'
  );

  const excelBuffer = XLSX.write(workbook, {

    bookType: 'xlsx',

    type: 'array'

  });

  const blob = new Blob(

    [excelBuffer],

    {

      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

    }

  );

  saveAs(blob, 'Subscribers.xlsx');

}
 async exportSubscribersPDF(): Promise<void> {

  const doc = new jsPDF('landscape');

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();


  // ==========================================
  // COLORS
  // ==========================================

  const navy: [number, number, number] =
    [30, 58, 120];

  const teal: [number, number, number] =
    [20, 125, 125];

  const green: [number, number, number] =
    [20, 155, 75];

  const red: [number, number, number] =
    [205, 45, 45];

  const lightGreen: [number, number, number] =
    [225, 245, 230];

  const lightRed: [number, number, number] =
    [250, 230, 230];

  const lightBlue: [number, number, number] =
    [230, 240, 250];


  // ==========================================
  // LOAD LOGO
  // ==========================================

  const logo =
    await this.loadImage(
      'zip_zip_info_logo.png'
    );


  if (logo) {

    const logoWidth = 45;

    const logoHeight =
      (logo.height / logo.width) * logoWidth;

    doc.addImage(
      logo,
      'PNG',
      (pageWidth - logoWidth) / 2,
      7,
      logoWidth,
      logoHeight
    );

  }





  // ==========================================
  // SYSTEM NAME
  // ==========================================

  doc.setFont(
    'helvetica',
    'normal'
  );

  doc.setFontSize(9);

  doc.setTextColor(
    55,
    55,
    55
  );

  doc.text(
    'Newsletter Management System',
    pageWidth / 2,
    41,
    {
      align: 'center'
    }
  );


  // ==========================================
  // SMALL TEAL DIVIDER
  // ==========================================

  doc.setDrawColor(
    teal[0],
    teal[1],
    teal[2]
  );

  doc.setLineWidth(0.8);

  doc.line(
    pageWidth / 2 - 55,
    47,
    pageWidth / 2 - 20,
    47
  );

  doc.line(
    pageWidth / 2 + 20,
    47,
    pageWidth / 2 + 55,
    47
  );


  // ==========================================
  // REPORT TITLE
  // ==========================================

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
    'SUBSCRIBER REPORT',
    pageWidth / 2,
    56,
    {
      align: 'center'
    }
  );


  // ==========================================
  // MAIN DIVIDER
  // ==========================================

  doc.setDrawColor(
    navy[0],
    navy[1],
    navy[2]
  );

  doc.setLineWidth(0.7);

  doc.line(
    15,
    63,
    pageWidth - 15,
    63
  );


  // ==========================================
  // GENERATED DATE
  // ==========================================

  const generatedDate =
    new Date().toLocaleString();

  doc.setFont(
    'helvetica',
    'normal'
  );

  doc.setFontSize(9);

  doc.setTextColor(
    35,
    35,
    35
  );

  doc.text(
    `Generated On: ${generatedDate}`,
    15,
    73
  );


  // ==========================================
  // SUBSCRIBER COUNTS
  // ==========================================

  const total =
    this.subscribers.length;

  const active =
    this.subscribers.filter(
      subscriber =>
        subscriber.status?.toLowerCase() === 'active'
    ).length;

  const inactive =
    this.subscribers.filter(
      subscriber =>
        subscriber.status?.toLowerCase() === 'inactive'
    ).length;


// ==========================================
// STATISTICS CARDS
// ==========================================

const cardWidth = 72;
const cardHeight = 25;
const cardGap = 18;

const totalCardsWidth =
  (cardWidth * 3) + (cardGap * 2);

const cardsStartX =
  (pageWidth - totalCardsWidth) / 2;

const cardsY = 80;


// ==========================================
// TOTAL SUBSCRIBERS CARD
// ==========================================

const totalX = cardsStartX;

doc.setFillColor(
  lightBlue[0],
  lightBlue[1],
  lightBlue[2]
);

doc.roundedRect(
  totalX,
  cardsY,
  cardWidth,
  cardHeight,
  3,
  3,
  'F'
);

doc.setFont(
  'helvetica',
  'bold'
);

doc.setFontSize(8);

doc.setTextColor(
  navy[0],
  navy[1],
  navy[2]
);

doc.text(
  'TOTAL SUBSCRIBERS',
  totalX + cardWidth / 2,
  cardsY + 9,
  {
    align: 'center'
  }
);

doc.setFontSize(15);

doc.text(
  `${total}`,
  totalX + cardWidth / 2,
  cardsY + 19,
  {
    align: 'center'
  }
);


// ==========================================
// ACTIVE CARD
// ==========================================

const activeX =
  totalX + cardWidth + cardGap;

doc.setFillColor(
  lightGreen[0],
  lightGreen[1],
  lightGreen[2]
);

doc.roundedRect(
  activeX,
  cardsY,
  cardWidth,
  cardHeight,
  3,
  3,
  'F'
);

doc.setFont(
  'helvetica',
  'bold'
);

doc.setFontSize(8);

doc.setTextColor(
  green[0],
  green[1],
  green[2]
);

doc.text(
  'ACTIVE',
  activeX + cardWidth / 2,
  cardsY + 9,
  {
    align: 'center'
  }
);

doc.setFontSize(15);

doc.text(
  `${active}`,
  activeX + cardWidth / 2,
  cardsY + 19,
  {
    align: 'center'
  }
);


// ==========================================
// INACTIVE CARD
// ==========================================

const inactiveX =
  activeX + cardWidth + cardGap;

doc.setFillColor(
  lightRed[0],
  lightRed[1],
  lightRed[2]
);

doc.roundedRect(
  inactiveX,
  cardsY,
  cardWidth,
  cardHeight,
  3,
  3,
  'F'
);

doc.setFont(
  'helvetica',
  'bold'
);

doc.setFontSize(8);

doc.setTextColor(
  red[0],
  red[1],
  red[2]
);

doc.text(
  'INACTIVE',
  inactiveX + cardWidth / 2,
  cardsY + 9,
  {
    align: 'center'
  }
);

doc.setFontSize(15);

doc.text(
  `${inactive}`,
  inactiveX + cardWidth / 2,
  cardsY + 19,
  {
    align: 'center'
  }
);

  // ==========================================
  // TABLE DATA
  // ==========================================

  const tableData =
    this.subscribers.map(
      subscriber => [

        subscriber.id,

        subscriber.name,

        subscriber.email,

        subscriber.phone,

        new Date(
          subscriber.subscribedAt
        ).toLocaleDateString(),

        subscriber.status
          ?.toLowerCase() === 'active'
          ? 'Active'
          : 'Inactive'

      ]
    );


  // ==========================================
  // TABLE
  // ==========================================

  autoTable(doc, {

    startY: 105,

    head: [[
      'ID',
      'Name',
      'Email',
      'Phone',
      'Joined',
      'Status'
    ]],

    body: tableData,

    theme: 'grid',

    styles: {

      fontSize: 9,

      cellPadding: 4,

      valign: 'middle',

      textColor: [
        65,
        65,
        65
      ]

    },

    headStyles: {

      fillColor: [
        teal[0],
        teal[1],
        teal[2]
      ],

      textColor: [
        255,
        255,
        255
      ],

      fontStyle: 'bold',

      halign: 'center',

      valign: 'middle'

    },

    columnStyles: {

      0: {
        halign: 'center',
        cellWidth: 18
      },

      1: {
        cellWidth: 48
      },

      2: {
        cellWidth: 78
      },

      3: {
        cellWidth: 42
      },

      4: {
        cellWidth: 38
      },

      5: {
        halign: 'center',
        cellWidth: 35
      }

    },


    // ========================================
    // STATUS BADGES
    // ========================================

    didParseCell: (data: any) => {

      if (
        data.section === 'body' &&
        data.column.index === 5
      ) {

        const status =
          String(data.cell.raw)
            .toLowerCase();

        if (status === 'active') {

          data.cell.styles.fillColor =
            lightGreen;

          data.cell.styles.textColor =
            green;

          data.cell.styles.fontStyle =
            'bold';

        }

        else {

          data.cell.styles.fillColor =
            lightRed;

          data.cell.styles.textColor =
            red;

          data.cell.styles.fontStyle =
            'bold';

        }

      }

    },


    // ========================================
    // FOOTER
    // ========================================

    didDrawPage: () => {

      doc.setDrawColor(
        teal[0],
        teal[1],
        teal[2]
      );

      doc.setLineWidth(0.5);

      doc.line(
        15,
        pageHeight - 17,
        pageWidth - 15,
        pageHeight - 17
      );


      doc.setFont(
        'helvetica',
        'bold'
      );

      doc.setFontSize(8);

      doc.setTextColor(
        navy[0],
        navy[1],
        navy[2]
      );

      doc.text(
        'ZIP ZIP INFO',
        15,
        pageHeight - 9
      );


      doc.setFont(
        'helvetica',
        'normal'
      );

      doc.setTextColor(
        75,
        75,
        75
      );

      doc.text(
        ' — Confidential Admin Report',
        57,
        pageHeight - 9
      );


      doc.text(
        `Page ${doc.getNumberOfPages()}`,
        pageWidth - 15,
        pageHeight - 9,
        {
          align: 'right'
        }
      );

    }

  });


  // ==========================================
  // SAVE
  // ==========================================

  doc.save(
    'ZIP_ZIP_INFO_Subscriber_Report.pdf'
  );

}

private loadImage(
  url: string
): Promise<HTMLImageElement | null> {

  return new Promise((resolve) => {

    const image = new Image();

    image.onload = () => {
      resolve(image);
    };

    image.onerror = () => {

      console.error(
        'Failed to load ZIP ZIP INFO logo:',
        url
      );

      resolve(null);

    };

    image.src = url;

  });

}
importSubscribers(event: any): void {

  const file = event.target.files[0];

  if (!file) {

    return;

  }

  const reader = new FileReader();

  reader.onload = (e: any) => {

    const workbook = XLSX.read(e.target.result, {

      type: 'binary'

    });

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json<any>(worksheet);

    const subscribers = data.map((row: any) => ({

      name: row.Name,

      email: row.Email,

      phone: String(row.Phone),

      password: row.Password || '123456'

    }));

    this.subscriberService.importSubscribers(subscribers).subscribe({

      next: (response) => {

        alert(response.message);

        this.loadSubscribers();

      },

      error: (error) => {

        console.error(error);

        alert('Import failed.');

      }

    });

  };

  reader.readAsBinaryString(file);

}

cancelDelete(): void {

  this.showDeleteModal = false;

  this.deleteSubscriberData = null;

}
  saveSubscriber(): void {

  if (!this.selectedSubscriber) {

    return;

  }

  console.log('Save button clicked');
  console.log(this.selectedSubscriber);

  this.subscriberService.updateSubscriber(

    this.selectedSubscriber.id,

    this.selectedSubscriber

  ).subscribe({

    next: () => {

      console.log('Update successful');

      this.selectedSubscriber = null;

      this.loadSubscribers();

    },

    error: (error) => {

      console.error('Update failed', error);

    }

  });

}

cancelEdit(): void {


this.selectedSubscriber = null;

}
}
