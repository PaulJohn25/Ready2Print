import RootLayout from "@/components/layouts/RootLayout";
import { Phone, Mail, MapPin, Printer, Menu } from "lucide-react";
import logo from "../../assets/logo.png";
import PrintingCalculator from "../PrintCalculator/PrintingCalculator";

const Home = () => {
  return (
    <RootLayout>
      <header className="bg-slate-200 py-3 border-b border-slate-300 px-5 flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-10 w-13 object-contain" />
          <h2 className="font-montserrat font-extrabold tracking-tight text-slate-800 scroll-m-20 text-base lg:text-4xl select-none">
            Ready2Print
          </h2>
        </div>
        <div>
          <Menu className="w-6 h-6 text-slate-800" />
        </div>
      </header>
      <main className="flex-grow container flex justify-center items-center px-5">
        <PrintingCalculator />
      </main>
      <footer className="px-5 flex flex-col gap-8 bg-slate-100">
        <div className="py-5">
          <h3 className="capitalize text-sm font-bold mb-4 text-blue-800 tracking-light font-montserrat">
            Print Service Information
          </h3>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Phone className="text-blue-700" />{" "}
              <p className="font-montserrat text-sm tracking-tight">
                Customer Support: (+63) 998-247-2976
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="text-blue-700" />{" "}
              <p className="font-montserrat text-sm tracking-tight">
                Email: imperialjohnpaul0@gmail.com
              </p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-blue-700" />{" "}
              <p className="font-montserrat text-sm tracking-tight">
                Location: Mabini St. Poblacion Guinobatan, Albay
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Printer className="text-blue-700" />{" "}
              <p className="font-montserrat text-sm tracking-tight">
                Business Hours: Mon-Sunday, 6AM-10PM
              </p>
            </div>
          </div>
          <p className="font-montserrat text-center leading-4 text-slate-500 text-sm mt-5 tracking-tight">
            For any questions or concerns about your print job, please dont't
            hesitate to contact our customer support.
          </p>
        </div>

        <p className="text-center font-montserrat text-xs text-slate-500 tracking-tight font-semibold">
          &copy; {new Date().getFullYear()} Ready2Print. All rights reserved.
        </p>
      </footer>
    </RootLayout>
  );
};

export default Home;
