import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HotTableRegisterer } from '@handsontable/angular';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrl: './excel.component.css'
})

export class ExcelComponent implements OnInit {
  private hotRegisterer = new HotTableRegisterer();
  data: any[] = [[]];
  colHeaders = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
      this.loadStoredData();
  }

  loadStoredData() {
    this.http.get('http://localhost:3000/data').subscribe((res: any) => {
      this.data = res.data;
    })
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.http.post('http://localhost:3000/upload', formData).subscribe((res: any) => {
      this.data = res.data;
    })
  }

  exportExcel() {
    this.http.post('http://localhost:3000/export', {data: this.data}, {responseType: 'blob'}).subscribe((blob) => {
      saveAs(blob, 'exported.xlsx');
    });
  }
}
