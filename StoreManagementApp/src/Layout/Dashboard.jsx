import { NavLink, Outlet } from "react-router-dom";
import { FaHome, FaList, FaUsers, FaPlusSquare } from "react-icons/fa";
const Dashboard = () => {
  return (
    <div className="flex">
      {/* Dashboard side bar  */}
      <div className="w-64 min-h-screen bg-blue-50">
        <ul className="menu p-4">
          <li>
            <NavLink to="/dashboard/admin-home">
              <FaHome></FaHome> Admin Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-category">
              <FaList></FaList> Manage Category
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-subcategory">
              <FaList></FaList> Manage Subcategory
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-subsubcategory">
              <FaList></FaList> Manage Sub-subcategory
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/add-products">
              <FaPlusSquare></FaPlusSquare> Add Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-products">
              <FaList></FaList> Manage Products
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/users">
              <FaUsers></FaUsers> All Users
            </NavLink>
          </li>
        </ul>
      </div>
      {/* Dashboard content  */}
      <div className="flex-1">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Dashboard;
