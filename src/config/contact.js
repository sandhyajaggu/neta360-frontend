// Company contact details shown in the footer and on the Contact page. Update them here.
export const CONTACT = {
  website: "www.neta360.in",
  email: "support@neta360.in",
  phone: "+91 96425 59099",
  phoneHref: "tel:+919642559099",
  whatsappHref: "https://wa.me/919642559099",
  // Office addresses; their names are "office_names" in the i18n files, in the same order.
  offices: [
    "5th floor, Wing-A, Statesman House, Barakhamba Rd, Barakhamba, New Delhi, Delhi 110001",
    "5th Floor, Babukhan Rasheed Plaza, Plot # 682, Road No. 36, Aditya Enclave, Venkatagiri, Jubilee Hills, Hyderabad, Telangana 500033",
  ],
  // City tag on each office card, in the same order as "offices".
  officeCities: ["New Delhi", "Hyderabad"],
  // Office opens Mon–Sat; the days are "ci_days" in the i18n files.
  hoursTime: "9:30 AM – 6:30 PM",
  desks: {
    demo: "sales@neta360.in",
    support: "support@neta360.in",
    partnership: "partners@neta360.in",
    media: "media@neta360.in",
  },
};

export const mapsHref = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
