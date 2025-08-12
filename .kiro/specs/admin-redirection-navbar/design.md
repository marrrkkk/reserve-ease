# Design Document

## Overview

This design implements automatic admin redirection and role-based navigation for the Laravel reservation system. The solution includes middleware for admin route protection, dashboard redirection logic, and dynamic navbar rendering based on user roles.

## Architecture

### Components Overview

-   **Admin Middleware**: Protects admin routes and handles authorization
-   **Dashboard Redirection Logic**: Automatically redirects admin users to admin dashboard
-   **Role-based Navigation Component**: Renders different navigation items based on user role
-   **Route Protection**: Ensures proper access control for admin functionality

### Data Flow

1. User authenticates and accesses dashboard
2. System checks user's `is_admin` status
3. If admin: redirect to admin dashboard, show admin navigation
4. If regular user: show regular dashboard and navigation
5. All admin routes protected by middleware

## Components and Interfaces

### 1. Admin Middleware (`app/Http/Middleware/AdminMiddleware.php`)

```php
class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            abort(403, 'Unauthorized access');
        }
        return $next($request);
    }
}
```

**Purpose**: Protect admin routes from unauthorized access
**Interface**: Standard Laravel middleware interface
**Dependencies**: User model with `is_admin` field

### 2. Enhanced Dashboard Controller

```php
class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Redirect admin users to admin dashboard
        if ($user->is_admin) {
            return redirect()->route('admin');
        }

        // Regular user dashboard logic
        $reservations = Reservation::where('user_id', $user->id)->latest()->take(3)->get();
        return Inertia::render('Dashboard', [
            'auth' => ['user' => $user],
            'reservation' => $reservations,
        ]);
    }
}
```

**Purpose**: Handle dashboard access and admin redirection
**Interface**: Returns Inertia response or redirect
**Dependencies**: Auth facade, Reservation model

### 3. Role-based Navigation Component (`resources/js/Components/Navigation.jsx`)

```jsx
const Navigation = ({ user }) => {
    const isAdmin = user.is_admin;

    const adminNavItems = [
        { name: "Dashboard", href: route("admin"), icon: LayoutDashboard },
        {
            name: "Reservations",
            href: route("admin.reservations"),
            icon: Calendar,
        },
        { name: "Users", href: route("admin.users"), icon: Users },
        { name: "Analytics", href: route("admin.analytics"), icon: BarChart },
    ];

    const userNavItems = [
        { name: "Dashboard", href: route("dashboard"), icon: Calendar },
        {
            name: "My Reservations",
            href: route("reservations.index"),
            icon: Calendar,
        },
        { name: "Packages", href: route("packages.index"), icon: Package },
    ];

    const navItems = isAdmin ? adminNavItems : userNavItems;

    return (
        <div className="navigation">
            {navItems.map((item) => (
                <NavLink key={item.name} {...item} />
            ))}
        </div>
    );
};
```

**Purpose**: Render appropriate navigation based on user role
**Interface**: React component accepting user prop
**Dependencies**: Inertia route helper, icon components

### 4. Enhanced Authenticated Layout

The existing `AuthenticatedLayout.jsx` will be modified to:

-   Use the new Navigation component
-   Display role indicator in user dropdown
-   Show admin-specific styling/badges when applicable

## Data Models

### User Model Enhancement

The existing User model already has the required `is_admin` field:

```php
protected $fillable = [
    'name',
    'email',
    'password',
    'is_admin',
];

protected function casts(): array
{
    return [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_admin' => 'boolean',
    ];
}
```

No additional database changes are required.

## Error Handling

### Middleware Error Handling

-   **403 Unauthorized**: When non-admin users attempt to access admin routes
-   **Redirect to login**: When unauthenticated users attempt to access protected routes
-   **Error messages**: Clear feedback for authorization failures

### Frontend Error Handling

-   **Route not found**: Graceful handling of invalid admin routes
-   **Permission denied**: User-friendly error pages for unauthorized access
-   **Network errors**: Proper error states for failed navigation

## Testing Strategy

### Backend Testing

1. **Middleware Tests**

    - Test admin user can access admin routes
    - Test non-admin user gets 403 on admin routes
    - Test unauthenticated user gets redirected to login

2. **Dashboard Redirection Tests**

    - Test admin user gets redirected to admin dashboard
    - Test regular user sees regular dashboard
    - Test redirection preserves query parameters

3. **Route Protection Tests**
    - Test all admin routes are protected
    - Test admin routes return correct responses for admin users
    - Test admin routes return 403 for regular users

### Frontend Testing

1. **Navigation Component Tests**

    - Test admin navigation items render for admin users
    - Test user navigation items render for regular users
    - Test navigation links have correct hrefs
    - Test active states work correctly

2. **Layout Integration Tests**

    - Test navigation integrates properly with layout
    - Test responsive behavior
    - Test accessibility features

3. **User Experience Tests**
    - Test smooth transitions between admin/user views
    - Test role indicators display correctly
    - Test logout functionality works from both contexts

### Integration Testing

1. **End-to-End Admin Flow**

    - Login as admin → auto-redirect to admin dashboard → navigate admin sections
    - Verify all admin functionality accessible through navigation

2. **End-to-End User Flow**

    - Login as regular user → access user dashboard → navigate user sections
    - Verify admin sections not accessible

3. **Role Switching Tests**
    - Test behavior when user role changes mid-session
    - Test proper cleanup of admin access when demoted

## Implementation Notes

### Security Considerations

-   All admin routes must use the AdminMiddleware
-   Frontend role checks are for UX only - backend validation is authoritative
-   Session management should handle role changes appropriately

### Performance Considerations

-   Navigation rendering should be efficient (avoid unnecessary re-renders)
-   Admin redirection should be fast (single redirect, no multiple checks)
-   Middleware should have minimal overhead

### Accessibility Considerations

-   Navigation should be keyboard accessible
-   Role indicators should be screen reader friendly
-   Error messages should be accessible
-   Focus management during redirections

### Browser Compatibility

-   Navigation should work across modern browsers
-   Responsive design for mobile devices
-   Graceful degradation for older browsers
