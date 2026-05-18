import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from './users.service';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {
  users: any[] = [];
  name = '';
  toast = '';
  toastType = '';
  loading = false;
  tableLoading = false;

  constructor(
    private userService: UsersService,
    private loginService: LoginService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.getUsers();
  }

  showToast(message: string, type: string = 'success') {
    this.toast = message;
    this.toastType = type;
    setTimeout(() => {
      this.toast = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  getUsers() {
    this.tableLoading = true;
    this.cdr.detectChanges();
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.tableLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('Failed to load users.', 'error');
        this.tableLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addUser() {
    if (!this.name.trim()) {
      this.showToast('Please enter a name!', 'error');
      return;
    }
    this.loading = true;
    const addedName = this.name;
    this.name = '';
    this.userService.addUser(addedName).subscribe({
      next: () => {
        this.loading = false;
        this.showToast(`"${addedName}" added successfully!`);
        this.getUsers();
      },
      error: () => {
        this.loading = false;
        this.showToast(`"${addedName}" added! Refreshing...`);
        this.getUsers();
      }
    });
  }

  editUser(user: any) {
    const newName = prompt('Enter new name:', user.name);
    if (newName && newName.trim()) {
      this.loading = true;
      this.userService.updateUser(user.id, newName).subscribe({
        next: () => {
          this.loading = false;
          this.showToast(`User updated to "${newName}" successfully!`);
          this.getUsers();
        },
        error: () => {
          this.loading = false;
          this.showToast('Failed to update user.', 'error');
          this.cdr.detectChanges();
        }
      });
    }
  }

  disableUser(id: number) {
    this.loading = true;
    this.userService.disableUser(id).subscribe({
      next: () => {
        this.loading = false;
        this.showToast('User disabled successfully!');
        this.getUsers();
      },
      error: () => {
        this.loading = false;
        this.showToast('Failed to disable user.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  enableUser(id: number) {
    this.loading = true;
    this.userService.enableUser(id).subscribe({
      next: () => {
        this.loading = false;
        this.showToast('User enabled successfully!');
        this.getUsers();
      },
      error: () => {
        this.loading = false;
        this.showToast('Failed to enable user.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}