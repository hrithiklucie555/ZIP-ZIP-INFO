import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
