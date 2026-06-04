import Navbar from "../components/user/navbar";
import Footer from "../components/user/footer";

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;