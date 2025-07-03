import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/users';

  constructor(private http: HttpClient) {}

 
  createUserFormData(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateUser(id: string, user: any, photo?: File): Observable<any> {
    if (photo) {
      const formData = new FormData();
      formData.append('file', photo);
      formData.append('user', JSON.stringify(user));
      return this.http.put(`${this.apiUrl}/${id}`, formData);
    } else {
      return this.http.put(`${this.apiUrl}/${id}`, user);
    }
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUserById(id: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/${id}`);
}

}
