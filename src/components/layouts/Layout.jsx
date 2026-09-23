import { Outlet } from 'react-router-dom';
import SideBarMenu from '../sideBarMenu/sideBarMenu';

export default function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <SideBarMenu />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}