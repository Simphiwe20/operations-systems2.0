# OperationsSystem

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.10.

## Development server

Run `ng s --o` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Prerequisite for ruining this app sucessfully
    -> To run the backend, ch to operations-systems-api
        -> Initialize the backend by running "npm install"
        -> Then, run "npm run start"

## Logs in
The is a default user, admin. Credntials are as follows.
    -> username(admin@opsystem.co) and password(admin@123)

## Functional Requirements for Operations Management System
1. Admin Module
    1.1 User Management
        The system shall allow the admin to log in securely.
        The system shall allow the admin to upload a spreadsheet to add multiple users at once.
        The system shall provide an interface for the admin to enable or disable user accounts.
        The system shall allow the admin to assign roles (Employee, Manager, HR Personnel, Admin).
    1.2 Dashboard & Reports
        The system shall display a dashboard showing user activeness based on logins and activity.
        The system shall display a dashboard showing the count of enabled and disabled users.
        The system shall allow the admin to export user activity reports in CSV, Excel, or PDF format.
    1.3 Notifications
        The system shall send email or in-system notifications to users when their account is created, enabled, or disabled.
2. Employee Module
    2.1 User Authentication
        The system shall allow employees to log in securely.
    2.2 Requests & Applications 
        The system shall allow employees to apply for leaves.
        The system shall allow employees to request transport.
        The system shall allow employees to request a visa.
        The system shall allow employees to request travel.
    2.3 Viewing & Tracking
        The system shall allow employees to view their pending leave requests.
        The system shall display a dashboard with a graphical representation of leave history.
        The system shall display all employee requests categorized by status (pending, approved, rejected) on a dashboard.
    2.4 Notifications
        The system shall notify employees via email and in-system notifications when their leave or request is approved/rejected.
        The system shall notify employees of any updates on their request status.
3. Operations/HR Personnel Module
    3.1 User Authentication
        The system shall allow operations/HR personnel to log in securely.
    3.2 Employee Monitoring & Reports
        The system shall display a list of employees currently on leave.
        The system shall provide a dashboard to view employee attendance records.
        The system shall allow operations/HR personnel to view all employee requests.
        The system shall provide a graphical dashboard showing employee leave trends.
        The system shall allow HR personnel to export reports of employee attendance, leave trends, and request history in CSV, Excel, or PDF format.
    3.3 Notifications
        The system shall notify HR personnel when a new request is submitted by an employee.
4. Manager Module
    4.1 User Authentication
        The system shall allow managers to log in securely.
    4.2 Approvals & Requests
        The system shall allow managers to approve or reject leave applications.
        The system shall allow managers to approve or reject other employee requests (transport, visa, travel).
    4.3 Viewing & Tracking
        The system shall provide a dashboard with a graphical representation of employee leave trends.
        The system shall provide a dashboard showing all employee requests categorized by status.
        The system shall allow managers to export leave request reports in CSV, Excel, or PDF format.
    4.4 Notifications
        The system shall notify managers when a leave or request is pending approval.
        The system shall notify employees when their leave/request is approved or rejected by the manager.
5. Role-Based Access Control (RBAC) 
    The system shall restrict functionalities based on user roles:
        Admin: Full access to user management and reports.
        Employee: Can submit and track requests but cannot approve/reject them.
        HR Personnel: Can view attendance, leaves, and export reports.
        Manager: Can approve/reject employee requests.
        The system shall ensure that unauthorized users cannot access restricted modules.