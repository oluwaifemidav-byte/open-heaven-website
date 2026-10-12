// Public client-side settings. Never put a Paystack secret key or Supabase service-role key here.
// Edit this file from your phone in GitHub or a text editor to change church details without building an admin page.
window.CHURCH_CONFIG = {
  churchName: "RCCG Open Heavens Church",
  churchEmail: "openheavenschurchrccg@gmail.com",
  churchAddress: "RF44+QXX, Canaan Land Rd, Camp, Loburo 110113, Ogun State",
  whatsappNumber: "2348107992687",
  paystackPublicKey: "",
  supabaseUrl: "https://qisiltulkmpbrhgwcgnl.supabase.co",
  supabaseAnonKey: "sb_publishable_9rID431sg6mztAu-88HrKg_eR-8E_k4",
  givingAccount: {
    bank: "Access Bank",
    accountName: "RCCG Open Heaven Parish",
    accountNumber: "1915851789",
    accountType: "Tithe and Offering"
  },
  givingAccounts: [
    {
      label: "Tithe and Offering",
      bank: "Access Bank",
      accountName: "RCCG Open Heaven Parish",
      accountNumber: "1915851789",
      accountType: "Tithe and Offering"
    },
    {
      label: "Project",
      bank: "Zenith Bank",
      accountName: "RCCG Open Heaven Project",
      accountNumber: "1012053369",
      accountType: "Project"
    }
  ],
  socialLinks: {
    youtube: "https://youtube.com/@rccgopenheavensparish?si=jn6uOHsddbKMbwnQ",
    instagram: "",
    facebook: "",
    whatsapp: "https://wa.me/2348107992687"
  },
  serviceTimes: [
    { day: "SUN", shortLabel: "Sunday Worship Service", detail: "Sunday School begins at 8:00 AM" },
    { day: "TUE", shortLabel: "Bible Study", detail: "6:00 PM – 7:00 PM" },
    { day: "THU", shortLabel: "Faith Clinic", detail: "6:00 PM – 7:00 PM" }
  ]
};
