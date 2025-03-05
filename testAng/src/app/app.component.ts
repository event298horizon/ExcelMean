import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { NgxFileDropModule } from 'ngx-file-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  data: any[] = [];
  columns: any[] = [
    { data: 'A', title: 'Column A' },
    { data: 'B', title: 'Column B' },
    { data: 'C', title: 'Column C' },
  ];

  settings = {
    colHeaders: ['Column A', 'Column B', 'Column C'],
    rowHeaders: true,
    stretchH: 'all',
    contextMenu: true,
    filters: true,
    dropdownMenu: true,
    columns: this.columns,
    data: this.data,
  };

  constructor(private http: HttpClient) {}

  onFileDropped(event: any) {
    const file = event[0];
    
    const formData = new FormData();
    formData.append('file', file);
  
    this.http.post('http://localhost:3000/api/upload-excel', formData)
      .subscribe((response: any) => {
        this.data = response;
        this.settings = { ...this.settings, data: this.data };
      }, error => {
        console.error('Error uploading file:', error);
      });
  }

  readExcel(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const binaryStr = e.target.result;
      const wb = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[sheetName];
      this.data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      this.settings = { ...this.settings, data: this.data };
    };
    reader.readAsBinaryString(file);
  }

  exportExcel() {
    this.http.get('http://localhost:3000/api/export-excel', { responseType: 'blob' })
      .subscribe((response: Blob) => {
        const fileURL = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = 'updated_excel.xlsx';
        a.click();
      }, error => {
        console.error('Error exporting Excel file:', error);
      });
  }
  

  onCellEdit(event: any) {
    const row = event[0][0];
    const col = event[0][1];
    const value = event[0][3];
  
    const updateData = { row, col, value };
  
    this.http.post('http://localhost:3000/api/update-cell', updateData)
      .subscribe(response => {
        console.log('Cell updated:', response);
      }, error => {
        console.error('Error updating cell:', error);
      });
  }
  
}
