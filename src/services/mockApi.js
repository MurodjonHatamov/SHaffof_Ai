// services/mockApi.js
export const mockApi = {
  getDashboardData: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      stats: {
        totalTenders: 1247,
        highRisk: 89,
        mediumRisk: 312,
        lowRisk: 846,
        todayAdded: 47,
        todaySuspicious: 12,
        dailyChange: 8.5,
        dailyData: [
          { date: '20/03', tenders: 42 },
          { date: '21/03', tenders: 38 },
          { date: '22/03', tenders: 45 },
          { date: '23/03', tenders: 52 },
          { date: '24/03', tenders: 48 },
          { date: '25/03', tenders: 44 },
          { date: '26/03', tenders: 47 },
        ],
        regionData: [
          { region: 'Toshkent', tenders: 342 },
          { region: 'Samarqand', tenders: 187 },
          { region: 'Farg‘ona', tenders: 156 },
          { region: 'Andijon', tenders: 98 },
          { region: 'Buxoro', tenders: 87 },
          { region: 'Qashqadaryo', tenders: 76 },
        ]
      },
      topRisks: [
        { name: 'Yo‘l qurilish ishlari', organization: 'Qurilish Invest MCHJ', amount: 1250000000, riskScore: 95 },
        { name: 'Maktab ta’mirlash', organization: 'Ta’lim Servis LLC', amount: 890000000, riskScore: 88 },
        { name: 'Kompyuter texnikasi', organization: 'Tech Solutions', amount: 450000000, riskScore: 82 },
        { name: 'Oziq-ovqat mahsulotlari', organization: 'Food Supply MCHJ', amount: 230000000, riskScore: 75 },
        { name: 'Tibbiy asbob-uskunalar', organization: 'MedTech Group', amount: 670000000, riskScore: 72 },
      ],
      recentTenders: [
        { date: '2026-03-27', organization: 'Qurilish Invest MCHJ', amount: 1250000000, riskScore: 95 },
        { date: '2026-03-27', organization: 'Ta’lim Servis LLC', amount: 890000000, riskScore: 88 },
        { date: '2026-03-26', organization: 'Tech Solutions', amount: 450000000, riskScore: 82 },
        { date: '2026-03-26', organization: 'Food Supply MCHJ', amount: 230000000, riskScore: 45 },
        { date: '2026-03-25', organization: 'MedTech Group', amount: 670000000, riskScore: 72 },
        { date: '2026-03-25', organization: 'Agro Business', amount: 120000000, riskScore: 28 },
        { date: '2026-03-24', organization: 'Logistik Center', amount: 340000000, riskScore: 55 },
      ],
      alerts: [
        { organization: 'Qurilish Invest MCHJ', amount: 1250000000, time: '5 daqiqa oldin' },
        { organization: 'Tech Solutions', amount: 450000000, time: '15 daqiqa oldin' },
      ]
    };
  },
  
  getNewAlert: async () => {
    const alerts = [
      { organization: 'Yangi Qurilish MCHJ', amount: 980000000, time: 'hozir' },
      { organization: 'Smart Tech LLC', amount: 560000000, time: 'hozir' },
    ];
    return Math.random() > 0.7 ? alerts[Math.floor(Math.random() * alerts.length)] : null;
  }
};