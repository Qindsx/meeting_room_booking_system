import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter, Link, Outlet } from 'react-router-dom';
import { Login } from './page/login';
import { Register } from './page/register';
import { UpdatePassword } from './page/updatePassword';
import { Index } from './page/index';
import { UpdateInfo } from './page/updateInfo';

function Aaa() {
  return <div>aaa</div>;
}

function Bbb() {
  return <div>bbb</div>;
}

function Layout() {
  return <div>
    <div>
      <Outlet />
    </div>
  </div>
}

function ErrorPage() {
  return <div>error</div>;
}

const routes = [
  {
    path: "/",
    element: <Index></Index>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'update_info',
        element: <UpdateInfo />
      },
    ]

  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "update_password",
    element: <UpdatePassword />,
  }
];
const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<RouterProvider router={router} />);
