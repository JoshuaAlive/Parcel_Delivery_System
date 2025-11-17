const Footer = () => {
  return (
    <div className="h-[300px] bg-[#e9eb77] flex items-center justify-between p-[30px] text-[#444]">
      <div className="flex flex-col">
        <img src="/logo.png" alt="" height={200} width={200} />
        <span className="w-[70%]">
          We understand that your parcels carry more than just items — they
          carry your trust. Committed to excellence.
        </span>
        <span>+2347057607821</span>
        <span>omotoshojoshua007@gmail.com</span>
      </div>
      <div className="flex flex-col">
        <span>Design by JoshuaAlive</span>
        <span>&copy; copyright 2025</span>
      </div>
    </div>
  );
};

export default Footer;
