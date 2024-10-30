import anpcsal from "../assets/anpc-sal.png"
import anpcsol from "../assets/anpc-sol.png"
import appstore from "../assets/app-store-logo-badge.png"
import google from "../assets/google-play-badge-logo-png.png"

type Link = {label:string, url:string}
const Copyright = () => {
  return (
    <span>© 2024 FlatFinder. All rights reserved.</span>
  );
};

const LinksColumn = ({ title, links } : {title:string, links: Link[]}) => {
  return (
    <span className="flex flex-col">
      <h4 className="font-semibold">{title}</h4>
      {links.map((link, index) => (
        <a key={index} href={link.url}>{link.label}</a>
      ))}
    </span>
  );
};

const Permits = () => {
    return (
            <span className='custom-min-width-520 grid grid-cols-2 gap-5 justify-self-auto sm:flex'  >
                    <span className='w-full flex flex-col gap-5 lg:flex-1'>
                        <h1>Find us also on</h1>
                        <hr className='hidden lg:flex border-[1px] border-white'/>
                        <span className='flex flex-col gap-3 sm:grid grid-cols-2'>
                            <a href="#"><img className='w-[120px] sm:w-[150px]' src={appstore} alt="app-store" /></a>
                            <a href="#"><img className='w-[120px] sm:w-[150px]' src={google} alt="google-play" /></a>
                        </span>
                    </span>
                    <span className='w-full mx-auto  flex flex-col gap-5 lg:flex-1'>
                        <h1>ANPC</h1>
                        <hr className='hidden lg:flex border-[1px] border-white'/>
                        <span className='flex flex-col gap-3 sm:grid grid-cols-2'>
                            <a href="https://anpc.ro/ce-este-sal/"><img className='w-[120px] sm:w-[150px]' src={anpcsal} alt="anpc-sal" /></a>
                            <a href="#"><img className='w-[120px] sm:w-[150px]' src={anpcsol} alt="anpc-sol" /></a>
                        </span>
                    </span>
            </span>
    )
}

const Footer = () => {

  const columns = [
    {
      title: 'Resources',
      links: [
        { label: 'Property guides', url: '#' },
        { label: 'Client guides', url: '#' },
        { label: 'Landlord guides', url: '#' },
      ],
    },
    {
      title: 'Info',
      links: [
        { label: 'Commercial terms', url: '#' },
        { label: 'GDPR', url: '#' },
        { label: 'Contact us', url: '#' },
      ],
    },
   
  ];

  return (
    <footer className="bg-gray-100 text-[#555561] font-weight-500 mt-10 p-4 flex flex-col gap-[25px]">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Copyright />
          {columns.map((column, index) => (
            <LinksColumn key={index} title={column.title} links={column.links} />
          ))}
        </div>
      </div>
      <div className='container mx-auto'>
            <div className='w-full flex sm:flex-col'>
                <Permits />
            </div>
      </div>
    </footer>
  );
};

export default Footer;
