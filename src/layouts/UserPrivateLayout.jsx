import Navbar from "../components/user/navbar";
import Footer from "../components/user/footer";

const UserPrivateLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default UserPrivateLayout;