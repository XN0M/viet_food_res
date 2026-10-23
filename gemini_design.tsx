import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Star,
  ShoppingBag,
  Calendar,
  ChevronRight,
  Sparkles,
  Utensils,
  Flame,
  Leaf,
  CheckCircle2,
  X,
  Plus,
  Minus,
  Navigation,
  Globe,
  Heart,
  Award,
  Coffee,
  Soup,
  Menu as MenuIcon,
  ArrowUpRight,
  Quote
} from 'lucide-react';

// ==========================================
// DATA & TRANSLATIONS (VIETNAMESE & SLOVAK)
// ==========================================
const translations = {
  vi: {
    branchBadge: 'Chi nhánh Dolný Štál • Bên Hồ (Pri jazere)',
    nav: {
      about: 'Không Gian',
      menu: 'Thực Đơn',
      reviews: 'Đánh Giá',
      location: 'Địa Chỉ & Giờ Mở Cửa',
      bookTable: 'Đặt Bàn',
    },
    hero: {
      subtitle: 'Hương vị Việt truyền thống giữa lòng Slovakia',
      title: 'Ẩm Thực Việt Ấm Áp Bên Hồ Dolný Štál',
      description:
        'Tọa lạc tại Pri jazere 1, VietFood Reštaurácia mang đến những tô Phở bò hầm xương 12 tiếng, vịt quay giòn rụm và nem rán thủ công trong không gian hiện đại, gần gũi và tràn ngập ánh sáng ấm áp.',
      exploreMenu: 'Khám Phá Thực Đơn',
      reserveBtn: 'Đặt Bàn Ngay',
      ratingText: '4.7 ★ trên Google Maps',
      addressShort: 'Pri jazere 1, 930 10 Dolný Štál',
      openStatus: 'Đang mở cửa phục vụ',
      closedStatus: 'Hiện đang nghỉ • Mở lại sớm',
    },
    features: {
      title: 'Trải Nghiệm Chi Nhánh Dolný Štál',
      subtitle: 'Sự giao thoa giữa nét mộc mạc truyền thống Việt Nam và phong cách bistro châu Âu đương đại.',
      f1Title: 'Nước Dùng Hầm 12 Giờ',
      f1Desc: 'Ninh từ xương ống bò tươi cùng thảo quả, quế, hồi nướng thơm lừng mỗi sáng.',
      f2Title: 'Không Gian Ấm Cúng "Pri Jazere"',
      f2Desc: 'Thiết kế gỗ ấm, ánh đèn vàng dịu nhẹ ngay khu vực bên hồ Dolný Štál yên bình.',
      f3Title: 'Rau Thơm & Nguyên Liệu Tươi',
      f3Desc: 'Rau mùi, húng quế, giá đỗ và nguyên liệu tuyển chọn tươi mới mỗi ngày.',
    },
    menu: {
      sectionTag: 'Thực Đơn Tinh Tuyển',
      title: 'Hương Vị Đậm Đà, Trình Bày Tinh Tế',
      subtitle: 'Chọn món yêu thích để đặt mang về (Takeaway) hoặc thưởng thức nóng hổi tại nhà hàng.',
      searchPlaceholder: 'Tìm món ăn (VD: Phở bò, Bún chả, Vịt giòn...)...',
      categories: {
        all: 'Tất Cả',
        pho_bun: 'Phở & Bún',
        main: 'Món Chính (Cơm & Mì)',
        starters: 'Khai Vị & Cuốn',
        drinks: 'Đồ Uống & Trà',
      },
      addToOrder: 'Thêm món',
      spicy: 'Cay nhẹ',
      bestseller: 'Bán chạy',
      fresh: 'Tươi mới',
    },
    branchInfo: {
      tag: 'Điểm Đến Ẩm Thực Tại Dolný Štál',
      title: 'Ghé Thăm VietFood Reštaurácia',
      desc: 'Nằm ngay tại địa chỉ Pri jazere 1 dễ tìm với chỗ đậu xe thuận tiện, chi nhánh Dolný Štál luôn sẵn sàng đón tiếp gia đình, bạn bè và thực khách gần xa.',
      addressLabel: 'Địa chỉ nhà hàng',
      phoneLabel: 'Điện thoại đặt món / đặt bàn',
      hoursLabel: 'Giờ mở cửa hàng tuần',
      monFri: 'Thứ Hai – Thứ Sáu',
      satSun: 'Thứ Bảy – Chủ Nhật',
      getDirections: 'Mở Bản Đồ Google Maps',
      callNow: 'Gọi Điện Ngay',
      parkingInfo: 'Có bãi đỗ xe miễn phí ngay trước nhà hàng • Phục vụ tại chỗ & Mang đi',
    },
    reviews: {
      tag: 'Khách Hàng Yêu Thích',
      title: 'Đánh Giá Thực Tế Từ Thực Khách',
      googleVerified: 'Xác thực từ Google Maps (4.7/5 ★)',
    },
    cart: {
      title: 'Giỏ Hàng Đặt Món',
      empty: 'Giỏ hàng của bạn đang trống. Hãy chọn vài món ngon từ thực đơn nhé!',
      total: 'Tổng tạm tính',
      pickupNote: 'Nhận món trực tiếp tại: Pri jazere 1, Dolný Štál (Chuẩn bị trong 15-20 phút)',
      customerName: 'Tên của bạn',
      customerPhone: 'Số điện thoại liên hệ',
      orderNote: 'Ghi chú (ít cay, không hành...)',
      submitOrder: 'Xác Nhận Đặt Món Mang Đi',
      orderSuccessTitle: 'Đặt Món Thành Công!',
      orderSuccessDesc: 'Nhà hàng VietFood Dolný Štál đã nhận đơn. Bạn có thể ghé nhận món sau khoảng 15–20 phút hoặc gọi +421 940 904 899 nếu cần hỗ trợ nhanh.',
    },
    reservation: {
      title: 'Đặt Bàn Tại Chi Nhánh Dolný Štál',
      subtitle: 'Giữ chỗ trước cho bữa trưa ấm cúng hoặc bữa tối sum vầy bên gia đình.',
      name: 'Họ và tên',
      phone: 'Số điện thoại',
      date: 'Ngày dùng bữa',
      time: 'Giờ đến',
      guests: 'Số lượng khách',
      notes: 'Yêu cầu đặc biệt (Bàn cạnh cửa sổ, ghế trẻ em...)',
      confirm: 'Hoàn Tất Đặt Bàn',
      successTitle: 'Đã Ghi Nhận Lịch Đặt Bàn!',
      successDesc: 'Cảm ơn bạn! Chúng tôi đã chuẩn bị bàn ấm cúng tại Pri jazere 1, Dolný Štál để đón tiếp bạn.',
    }
  },
  sk: {
    branchBadge: 'Pobočka Dolný Štál • Pri jazere 1',
    nav: {
      about: 'O nás',
      menu: 'Jedálny lístok',
      reviews: 'Recenzie',
      location: 'Kontakt & Otváracie hodiny',
      bookTable: 'Rezervácia stola',
    },
    hero: {
      subtitle: 'Autentická vietnamská kuchyňa v srdci Dolného Štálu',
      title: 'Moderná & Hrejivá Chuť Vietnamu Pri Jazere',
      description:
        'Navštívte VietFood Reštauráciu na adrese Pri jazere 1. Vychutnajte si poctivý 12-hodinový vývar Phở, chrumkavú kačicu, čerstvé jarné závitky a príjemnú rodinnú atmosféru.',
      exploreMenu: 'Zobraziť Menu',
      reserveBtn: 'Rezervovať Stôl',
      ratingText: '4.7 ★ na Google Maps',
      addressShort: 'Pri jazere 1, 930 10 Dolný Štál',
      openStatus: 'Práve otvorené',
      closedStatus: 'Momentálne zatvorené',
    },
    features: {
      title: 'Prečo Navštíviť Pobočku Dolný Štál',
      subtitle: 'Spojenie tradičných vietnamských receptov, čerstvých byliniek a útulného moderného prostredia.',
      f1Title: '12-Hodinový Poctivý Vývar',
      f1Desc: 'Tradičné Phở pripravované z pomaly vareného hovädzieho vývaru so škoricou, badiánom a zázvorom.',
      f2Title: 'Útulná Atmosféra Pri Jazere',
      f2Desc: 'Teplý a čistý interiér s príjemným osvetlením, ideálny na rýchly obed aj pokojnú večeru.',
      f3Title: 'Čerstvé Suroviny Každý Deň',
      f3Desc: 'Chrumkavá zelenina, voňavý koriander a jedlá pripravované priamo na objednávku vo woku.',
    },
    menu: {
      sectionTag: 'Náš Jedálny Lístok',
      title: 'Obľúbené Špeciality VietFood',
      subtitle: 'Vyberte si z našej ponuky na osobný odber (Takeaway) alebo si jedlo vychutnajte u nás.',
      searchPlaceholder: 'Hľadať jedlo (napr. Phở bò, Bún chả, Chrumkavá kačica...)...',
      categories: {
        all: 'Všetko',
        pho_bun: 'Polievky Phở & Bún',
        main: 'Hlavné Jedlá (Ryža & Rezance)',
        starters: 'Predjedlá & Závitky',
        drinks: 'Nápoje & Čaje',
      },
      addToOrder: 'Pridať',
      spicy: 'Jemne pikantné',
      bestseller: 'Bestseller',
      fresh: 'Čerstvé',
    },
    branchInfo: {
      tag: 'Kde Nás Nájdete',
      title: 'Navštívte VietFood Dolný Štál',
      desc: 'Nachádzame sa na výbornej adrese Pri jazere 1 v obci Dolný Štál s pohodlným parkovaním priamo pred reštauráciou.',
      addressLabel: 'Adresa prevádzky',
      phoneLabel: 'Telefónne číslo (Objednávky)',
      hoursLabel: 'Otváracie hodiny',
      monFri: 'Pondelok – Piatok',
      satSun: 'Sobota – Nedeľa',
      getDirections: 'Navigovať cez Google Maps',
      callNow: 'Zavolať Teraz',
      parkingInfo: 'Bezplatné parkovanie pri reštaurácii • Konzumácia na mieste aj jedlo so sebou',
    },
    reviews: {
      tag: 'Recenzie Hostí',
      title: 'Čo O Nás Hovoria Zákazníci',
      googleVerified: 'Overené recenzie z Google Maps (4.7/5 ★)',
    },
    cart: {
      title: 'Objednávka So Sebou',
      empty: 'Váš košík je zatiaľ prázdny. Vyberte si chutné jedlo z nášho lístka!',
      total: 'Spolu na úhradu',
      pickupNote: 'Osobný odber: Pri jazere 1, Dolný Štál (Príprava cca 15-20 minút)',
      customerName: 'Vaše meno',
      customerPhone: 'Telefónne číslo',
      orderNote: 'Poznámka k jedlu (bez cibule, menej štipľavé...)',
      submitOrder: 'Odoslať Objednávku na Odber',
      orderSuccessTitle: 'Objednávka Prijatá!',
      orderSuccessDesc: 'Ďakujeme! Vaše jedlo pripravujeme na pobočke Pri jazere 1, Dolný Štál. Vyzdvihnúť si ho môžete o 15–20 minút.',
    },
    reservation: {
      title: 'Rezervácia Stola – Dolný Štál',
      subtitle: 'Rezervujte si stôl vopred a užite si príjemné posedenie s rodinou alebo priateľmi.',
      name: 'Meno a priezvisko',
      phone: 'Telefónne číslo',
      date: 'Dátum návštevy',
      time: 'Čas príchodu',
      guests: 'Počet osôb',
      notes: 'Špeciálne požiadavky (stôl pri okne, detská stolička...)',
      confirm: 'Potvrdiť Rezerváciu',
      successTitle: 'Rezervácia Potvrdená!',
      successDesc: 'Tešíme sa na vašu návštevu vo VietFood Reštaurácii na adrese Pri jazere 1, Dolný Štál.',
    }
  }
};

const menuItems = [
  {
    id: 'pho-bo-dac-biet',
    code: 'P1',
    category: 'pho_bun',
    nameVi: 'Phở Bò Đặc Biệt (Tái Chín)',
    nameSk: 'Phở Bò Špeciál (Hovädzia polievka)',
    descVi: 'Nước dùng xương bò hầm 12 tiếng, bánh phở mềm, thịt bò tái & nạm chín, hành lá, ngò gai và rau thơm.',
    descSk: 'Tradičný 12-hodinový silný hovädzí vývar, široké ryžové rezance, hovädzie mäso, čerstvé bylinky a koriander.',
    price: 7.90,
    badge: 'bestseller',
    spicy: false,
    fresh: true,
    calories: '620 kcal',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'bun-bo-nam-bo',
    code: 'B2',
    category: 'pho_bun',
    nameVi: 'Bún Bò Nam Bộ Trộn Đậm Đà',
    nameSk: 'Bún Bò Nam Bộ (Teplý rezancový šalát)',
    descVi: 'Bún tươi, thịt bò xào sả ớt thơm lừng, đậu phộng rang, hành phi giòn, rau sống và nước mắm chua ngọt ấm.',
    descSk: 'Jemné ryžové rezance, restované hovädzie mäso na citrónovej tráve, čerstvá zelenina, arašidy, chrumkavá cibuľka a tradičná zálievka.',
    price: 8.50,
    badge: 'bestseller',
    spicy: false,
    fresh: true,
    calories: '680 kcal',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'bun-cha-ha-noi',
    code: 'B3',
    category: 'pho_bun',
    nameVi: 'Bún Chả Nướng & Nem Rán Hà Nội',
    nameSk: 'Bún Chả & Nem (Grilované bravčové s rezancami)',
    descVi: 'Thịt heo nướng than thơm phức kết hợp nem rán giòn, ăn kèm bún tươi, đu đủ ngâm và nước chấm truyền thống.',
    descSk: 'Grilované marinované bravčové mäso a chrumkavé závitky s ryžovými rezancami, bylinkami a sladkokyslou omáčkou.',
    price: 8.90,
    badge: 'bestseller',
    spicy: false,
    fresh: true,
    calories: '740 kcal',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'vit-quay-gion',
    code: 'M1',
    category: 'main',
    nameVi: 'Cơm Vịt Quay Giòn Sốt Teriyaki / Chua Ngọt',
    nameSk: 'Chrumkavá Kačica s Jazmínovou Ryžou',
    descVi: 'Đùi và ức vịt chiên giòn lớp da vàng óng, thịt mềm mọng nước, phục vụ cùng cơm hoa nhài dẻo thơm và salad tươi.',
    descSk: 'Voňavá chrumkavá kačica s jazmínovou ryžou, čerstvým šalátom a výberom domácej teriyaki alebo sladkokyslej omáčky.',
    price: 9.50,
    badge: 'bestseller',
    spicy: false,
    fresh: false,
    calories: '790 kcal',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'mi-xao-ga-gion',
    code: 'M2',
    category: 'main',
    nameVi: 'Mì Xào Wok Gà Giòn Rau Củ Tươi',
    nameSk: 'Restované Rezance s Chrumkavým Kuracím Mäsom',
    descVi: 'Mì trứng áp chảo lửa lớn trên chảo Wok cùng rau củ giòn ngọt, phủ lớp gà chiên giòn vàng rụm và hành phi.',
    descSk: 'Wok vaječné rezance restované s čerstvou zeleninou a kúskami zlatistého chrumkavého kuracieho mäsa.',
    price: 7.80,
    badge: null,
    spicy: false,
    fresh: false,
    calories: '710 kcal',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'ca-ri-do-thai-viet',
    code: 'M3',
    category: 'main',
    nameVi: 'Cà Ri Đỏ Nước Cốt Dừa Tôm / Gà',
    nameSk: 'Červené Kokosové Kari (Kuracie alebo Krevety)',
    descVi: 'Sốt cà ri đỏ béo ngậy từ nước cốt dừa, măng tươi, ớt chuông, lá chanh Thái và cơm trắng dẻo nóng hổi.',
    descSk: 'Jemne pikantné krémové kokosové kari s čerstvou zeleninou, citrónovou trávou a voňavou jazmínovou ryžou.',
    price: 8.60,
    badge: null,
    spicy: true,
    fresh: true,
    calories: '690 kcal',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'nem-ran-ha-noi',
    code: 'K1',
    category: 'starters',
    nameVi: 'Nem Rán Truyền Thống Việt Nam (3 Cuốn)',
    nameSk: 'Nem Rán – Vyprážané Jarné Závitky (3 ks)',
    descVi: 'Nhân thịt heo băm, mộc nhĩ, miến dong, cà rốt cuốn bánh đa nem chiên vàng giòn rụm, chấm nước mắm tỏi ớt.',
    descSk: 'Domáce chrumkavé vietnamské závitky plnené mäsom, sklenenými rezancami a zeleninou, podávané s tradičnou omáčkou.',
    price: 4.50,
    badge: 'bestseller',
    spicy: false,
    fresh: false,
    calories: '380 kcal',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'goi-cuon-tom-thit',
    code: 'K2',
    category: 'starters',
    nameVi: 'Gỏi Cuốn Tôm Thịt Tươi Mát (2 Cuốn)',
    nameSk: 'Gỏi Cuốn – Čerstvé Letné Závitky s Krevetami (2 ks)',
    descVi: 'Bánh tráng cuốn tôm tươi, thịt luộc, bún, xà lách và rau thơm thanh mát, chấm sốt tương đậu phộng hoặc nước mắm.',
    descSk: 'Ľahké ryžové závitky s krevetami, bylinkami, ryžovými rezancami a šalátom, podávané s arašidovou alebo rybacou omáčkou.',
    price: 4.90,
    badge: null,
    spicy: false,
    fresh: true,
    calories: '260 kcal',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'tra-chanh-sa-mat-ong',
    code: 'D1',
    category: 'drinks',
    nameVi: 'Trà Nhài Chanh Sả Mật Ong Nhiệt Đới',
    nameSk: 'Domáci Jazmínový Ľadový Čaj s Citrónovou Trávou',
    descVi: 'Trà hoa nhài ủ lạnh thanh mát kết hợp sả tươi, lát chanh vàng và mật ong rừng dịu nhẹ.',
    descSk: 'Osviežujúci domáci ľadový čaj s čerstvou citrónovou trávou, limetkou, mätou a kvapkou medu.',
    price: 3.20,
    badge: null,
    spicy: false,
    fresh: true,
    calories: '110 kcal',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'ca-phe-sua-da-viet',
    code: 'D2',
    category: 'drinks',
    nameVi: 'Cà Phê Phin Sữa Đá Sài Gòn',
    nameSk: 'Tradičná Vietnamská Káva s Kondenzovaným Mliekom',
    descVi: 'Cà phê hạt Robusta Việt Nam pha phin đậm đà quyện cùng sữa đặc ngọt dịu, dùng nóng hoặc thêm đá.',
    descSk: 'Silná vietnamská prekvapkávaná káva Phin so sladkým kondenzovaným mliekom (teplá alebo ľadová).',
    price: 3.50,
    badge: 'bestseller',
    spicy: false,
    fresh: false,
    calories: '180 kcal',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80'
  }
];

const customerReviews = [
  {
    id: 1,
    author: 'Marek Kováč',
    dateVi: '2 tuần trước',
    dateSk: 'pred 2 týždňami',
    rating: 5,
    textVi: 'Phở bò và vịt giòn ở chi nhánh Dolný Štál thực sự xuất sắc! Khẩu phần lớn, nước dùng rất thơm và nóng hổi, nhân viên luôn niềm nở.',
    textSk: 'Výborné Phở bò a chrumkavá kačica! Veľké porcie, vždy čerstvá zelenina a veľmi milá obsluha priamo tu v Dolnom Štále. Určite odporúčam.'
  },
  {
    id: 2,
    author: 'Zuzana Horváthová',
    dateVi: '1 tháng trước',
    dateSk: 'pred mesiacom',
    rating: 5,
    textVi: 'Không gian sạch sẽ, ấm cúng ngay khu vực Pri jazere. Bún Bò Nam Bộ rất vừa miệng, rau sống tươi, đặt mang về cũng được đóng gói cực kỳ cẩn thận.',
    textSk: 'Krásne, čisté prostredie a rýchla obsluha. Bún Bò Nam Bộ chutí fantasticky, chrumkavé závitky sú vždy čerstvo pripravené. Chodíme sem pravidelne celá rodina.'
  },
  {
    id: 3,
    author: 'Nguyễn Minh Tuấn',
    dateVi: '3 tuần trước',
    dateSk: 'pred 3 týždňami',
    rating: 5,
    textVi: 'Quán chuẩn vị Việt Nam tại Slovakia. Nước phở ngọt thanh từ xương, bún chả thơm lừng. Rất tự hào khi có một nhà hàng Việt chất lượng như vậy ở Dolný Štál!',
    textSk: 'Autentická vietnamská chuť! Vývar je poctivý a voňavý, presne ako doma vo Vietname. Skvelé parkovanie priamo pred reštauráciou Pri jazere 1.'
  }
];

export default function App() {
  const [lang, setLang] = useState('vi'); // 'vi' or 'sk'
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([
    { item: menuItems[0], quantity: 1 }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Order & Reservation states
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', note: '' });
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [reserveForm, setReserveForm] = useState({
    name: '',
    phone: '',
    date: '2025-05-16',
    time: '18:00',
    guests: '2',
    notes: ''
  });
  const [reserveSubmitted, setReserveSubmitted] = useState(false);

  const t = translations[lang];

  // Check if restaurant is currently open in Slovakia timezone
  const isOpenNow = useMemo(() => {
    try {
      const now = new Date();
      const day = now.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
      const hour = now.getHours();
      const isWeekend = day === 0 || day === 6;
      const openHour = isWeekend ? 9 : 8;
      const closeHour = 20;
      return hour >= openHour && hour < closeHour;
    } catch {
      return true;
    }
  }, []);

  // Show temporary toast notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Filtered menu items
  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;
      const matchesSearch =
        item.nameVi.toLowerCase().includes(q) ||
        item.nameSk.toLowerCase().includes(q) ||
        item.descVi.toLowerCase().includes(q) ||
        item.descSk.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Cart manipulation
  const addToCart = (dish) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === dish.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item: dish, quantity: 1 }];
    });
    const dishName = lang === 'vi' ? dish.nameVi : dish.nameSk;
    triggerToast(
      lang === 'vi'
        ? `Đã thêm "${dishName}" vào giỏ đặt món`
        : `Pridané do košíka: "${dishName}"`
    );
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((entry) =>
          entry.item.id === id
            ? { ...entry, quantity: Math.max(0, entry.quantity + delta) }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const totalItems = cart.reduce((acc, cur) => acc + cur.quantity, 0);
  const totalPrice = cart.reduce(
    (acc, cur) => acc + cur.item.price * cur.quantity,
    0
  );

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.phone) return;
    setOrderSubmitted(true);
    setTimeout(() => {
      setCart([]);
    }, 400);
  };

  const handleReserveSubmit = (e) => {
    e.preventDefault();
    if (!reserveForm.name || !reserveForm.phone) return;
    setReserveSubmitted(true);
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="min-h-screen selection:bg-[#C85A32] selection:text-white antialiased"
      style={{
        backgroundColor: '#FAF6F0',
        color: '#231F20',
        fontFamily:
          "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      {/* Google Fonts Injection for Serif Headings + Smooth Sans */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .font-editorial {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float {
          animation: floatSlow 5s ease-in-out infinite;
        }
      `}</style>

      {/* Top Information Bar */}
      <div className="bg-[#231F20] text-[#FAF6F0] text-xs sm:text-sm py-2.5 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="https://www.google.com/maps/search/Pri+jazere+1,+930+10+Doln%C3%BD+%C5%A0t%C3%A1l"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-[#D98A3C] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D98A3C] shrink-0" />
              <span>Pri jazere 1, 930 10 Dolný Štál, Slovakia</span>
            </a>
            <span className="hidden md:inline text-white/30">•</span>
            <div className="hidden md:flex items-center gap-1.5 text-[#E8DFD1]">
              <Clock className="w-3.5 h-3.5 text-[#D98A3C]" />
              <span>Pon–Pia: 08:00–20:00 | So–Ne: 09:00–20:00</span>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <a
              href="tel:+421940904899"
              className="flex items-center gap-1.5 font-medium text-[#D98A3C] hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+421 940 904 899</span>
            </a>

            {/* Language Switcher Pill */}
            <div className="flex items-center bg-white/10 rounded-full p-0.5 border border-white/15">
              <button
                onClick={() => setLang('vi')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                  lang === 'vi'
                    ? 'bg-[#C85A32] text-white shadow-sm'
                    : 'text-[#FAF6F0]/75 hover:text-white'
                }`}
              >
                🇻🇳 Tiếng Việt
              </button>
              <button
                onClick={() => setLang('sk')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                  lang === 'sk'
                    ? 'bg-[#C85A32] text-white shadow-sm'
                    : 'text-[#FAF6F0]/75 hover:text-white'
                }`}
              >
                🇸🇰 Slovenčina
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Glassmorphism Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FAF6F0]/90 border-b border-[#E5DEC9] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C85A32] to-[#9E3F1D] flex items-center justify-center text-white shadow-md shadow-[#C85A32]/20 group-hover:scale-105 transition-transform">
              <Soup className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#231F20]">
                  VietFood
                </span>
                <span className="text-[11px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#4A6B53]/15 text-[#4A6B53] font-semibold">
                  Dolný Štál
                </span>
              </div>
              <p className="text-xs text-[#6E655F] hidden sm:block">
                Reštaurácia • Pri jazere 1
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#3D3633]">
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-[#C85A32] transition-colors"
            >
              {t.nav.about}
            </button>
            <button
              onClick={() => scrollToSection('menu')}
              className="hover:text-[#C85A32] transition-colors"
            >
              {t.nav.menu}
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="hover:text-[#C85A32] transition-colors"
            >
              {t.nav.reviews}
            </button>
            <button
              onClick={() => scrollToSection('location')}
              className="hover:text-[#C85A32] transition-colors"
            >
              {t.nav.location}
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setReserveSubmitted(false);
                setIsReserveOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#C85A32]/30 bg-white/80 hover:bg-[#C85A32]/10 text-[#C85A32] font-semibold text-sm transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.nav.bookTable}</span>
            </button>

            <button
              onClick={() => {
                setOrderSubmitted(false);
                setIsCartOpen(true);
              }}
              className="relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#B24B26] text-white font-semibold text-sm shadow-md shadow-[#C85A32]/25 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden md:inline">
                {lang === 'vi' ? 'Giỏ Món' : 'Objednávka'}
              </span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-white text-[#C85A32] font-bold">
                {totalItems}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-[#F3ECE1] text-[#231F20] hover:bg-[#E5DEC9]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF6F0] border-b border-[#E5DEC9] px-4 pt-3 pb-6 space-y-3 shadow-xl">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => scrollToSection('about')}
                className="text-left px-4 py-2.5 rounded-xl bg-[#F3ECE1] font-medium text-sm"
              >
                {t.nav.about}
              </button>
              <button
                onClick={() => scrollToSection('menu')}
                className="text-left px-4 py-2.5 rounded-xl bg-[#F3ECE1] font-medium text-sm"
              >
                {t.nav.menu}
              </button>
              <button
                onClick={() => scrollToSection('reviews')}
                className="text-left px-4 py-2.5 rounded-xl bg-[#F3ECE1] font-medium text-sm"
              >
                {t.nav.reviews}
              </button>
              <button
                onClick={() => scrollToSection('location')}
                className="text-left px-4 py-2.5 rounded-xl bg-[#F3ECE1] font-medium text-sm"
              >
                {t.nav.location}
              </button>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setReserveSubmitted(false);
                setIsReserveOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-[#231F20] text-white font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#D98A3C]" />
              <span>{t.nav.bookTable}</span>
            </button>
          </div>
        )}
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#231F20] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/10 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#D98A3C] shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ==========================================
          HERO SECTION (WARM, MODERN LAKESIDE AMBIANCE)
      ========================================== */}
      <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-24">
        {/* Ambient Decorative Radial Gradients */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-35"
          style={{ background: 'radial-gradient(circle, #D98A3C 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute top-1/3 -right-24 w-96 h-96 rounded-full blur-3xl opacity-25"
          style={{ background: 'radial-gradient(circle, #C85A32 0%, transparent 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Warm Storytelling & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#F3ECE1] border border-[#E2D6C3]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4A6B53] animate-pulse" />
                <span className="text-xs font-semibold tracking-wide uppercase text-[#4A6B53]">
                  {t.branchBadge}
                </span>
                <span className="text-xs text-[#8C827A]">|</span>
                <span className="text-xs font-medium text-[#5A524C]">
                  {isOpenNow ? t.hero.openStatus : t.hero.closedStatus}
                </span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-6xl lg:text-[64px] font-bold leading-[1.08] tracking-tight text-[#231F20]">
                {t.hero.title}
              </h1>

              <p className="text-base sm:text-lg text-[#5A524C] leading-relaxed max-w-2xl">
                {t.hero.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => scrollToSection('menu')}
                  className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-[#C85A32] hover:bg-[#B24B26] text-white font-semibold text-base shadow-lg shadow-[#C85A32]/25 hover:-translate-y-0.5 transition-all"
                >
                  <Utensils className="w-5 h-5" />
                  <span>{t.hero.exploreMenu}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setReserveSubmitted(false);
                    setIsReserveOpen(true);
                  }}
                  className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-[#F3ECE1] hover:bg-[#E7DDD0] text-[#231F20] font-semibold text-base border border-[#DED2C1] transition-all"
                >
                  <Calendar className="w-5 h-5 text-[#C85A32]" />
                  <span>{t.hero.reserveBtn}</span>
                </button>
              </div>

              {/* Branch Trust Badges */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-[#E6DEC8] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#D98A3C]/15 flex items-center justify-center text-[#D98A3C] shrink-0">
                    <Star className="w-5 h-5 fill-[#D98A3C]" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#231F20]">4.7 / 5.0 ★</div>
                    <div className="text-xs text-[#6E655F]">Google Maps Reviews</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-[#E6DEC8] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#C85A32]/15 flex items-center justify-center text-[#C85A32] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#231F20]">Pri jazere 1</div>
                    <div className="text-xs text-[#6E655F]">930 10 Dolný Štál</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-[#E6DEC8] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#4A6B53]/15 flex items-center justify-center text-[#4A6B53] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#231F20]">+421 940 904 899</div>
                    <div className="text-xs text-[#6E655F]">Takeaway & Info</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Dish Frame */}
                <div className="relative rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-[#231F20]">
                  <img
                    src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1000&q=85"
                    alt="VietFood Phở Bò Đặc Biệt Dolný Štál"
                    className="w-full h-[420px] sm:h-[470px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#231F20]/80 via-transparent to-transparent" />

                  {/* Bottom overlay info inside image */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-[#C85A32] text-xs font-semibold mb-2">
                        Signature Dish • Dolný Štál
                      </span>
                      <h3 className="font-editorial text-2xl font-bold">
                        Phở Bò Đặc Biệt 12h
                      </h3>
                      <p className="text-xs text-white/80">
                        {lang === 'vi'
                          ? 'Nước cốt xương bò hầm thảo mộc truyền thống'
                          : 'Poctivý 12-hodinový hovädzí vývar s čerstvými bylinkami'}
                      </p>
                    </div>
                    <button
                      onClick={() => addToCart(menuItems[0])}
                      className="px-4 py-2.5 rounded-xl bg-white text-[#231F20] hover:bg-[#D98A3C] hover:text-white font-bold text-sm transition-colors shadow-lg shrink-0"
                    >
                      7.90 € +
                    </button>
                  </div>
                </div>

                {/* Floating Ambient Card 1: Location Lakeside Tag */}
                <div className="hidden sm:flex animate-float absolute -top-5 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#E5DEC9] items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#4A6B53] text-white flex items-center justify-center">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#4A6B53]">
                      100% Fresh Herbs
                    </div>
                    <div className="text-sm font-bold text-[#231F20]">
                      {lang === 'vi' ? 'Rau thơm tươi mỗi ngày' : 'Čerstvý koriander & bylinky'}
                    </div>
                  </div>
                </div>

                {/* Floating Ambient Card 2: Opening Hours Pill */}
                <div className="hidden sm:flex absolute -bottom-5 -right-5 bg-[#231F20] text-white p-4 rounded-2xl shadow-xl border border-white/10 items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D98A3C]/20 text-[#D98A3C] flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-white/70">
                      {lang === 'vi' ? 'Mở cửa mỗi ngày đến' : 'Otvorené každý deň do'}
                    </div>
                    <div className="text-sm font-bold text-[#D98A3C]">
                      20:00 • Pri jazere 1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          HIGHLIGHT SECTION: WARM AMBIANCE & CRAFT
      ========================================== */}
      <section id="about" className="py-16 bg-[#F3ECE1] border-y border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C85A32]">
              VIETFOOD REŠTAURÁCIA • DOLNÝ ŠTÁL
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#231F20] mt-2">
              {t.features.title}
            </h2>
            <p className="text-[#5A524C] mt-3 text-sm sm:text-base">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF6F0] p-7 rounded-3xl border border-[#E5DEC9] hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#C85A32]/15 text-[#C85A32] flex items-center justify-center mb-5">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#231F20] mb-2">
                {t.features.f1Title}
              </h3>
              <p className="text-sm text-[#5A524C] leading-relaxed">
                {t.features.f1Desc}
              </p>
            </div>

            <div className="bg-[#FAF6F0] p-7 rounded-3xl border border-[#E5DEC9] hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#D98A3C]/15 text-[#D98A3C] flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#231F20] mb-2">
                {t.features.f2Title}
              </h3>
              <p className="text-sm text-[#5A524C] leading-relaxed">
                {t.features.f2Desc}
              </p>
            </div>

            <div className="bg-[#FAF6F0] p-7 rounded-3xl border border-[#E5DEC9] hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#4A6B53]/15 text-[#4A6B53] flex items-center justify-center mb-5">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#231F20] mb-2">
                {t.features.f3Title}
              </h3>
              <p className="text-sm text-[#5A524C] leading-relaxed">
                {t.features.f3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          INTERACTIVE MENU SECTION WITH SMOOTH TABS
      ========================================== */}
      <section id="menu" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C85A32]">
                <Utensils className="w-3.5 h-3.5" />
                {t.menu.sectionTag}
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#231F20] mt-2">
                {t.menu.title}
              </h2>
              <p className="text-[#5A524C] mt-2 text-sm sm:text-base max-w-xl">
                {t.menu.subtitle}
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-80">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.menu.searchPlaceholder}
                  className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white border border-[#DED2C1] text-sm text-[#231F20] placeholder-[#8C827A] focus:outline-none focus:border-[#C85A32] shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#231F20]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {Object.entries(t.menu.categories).map(([key, label]) => {
              const active = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-5 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all ${
                    active
                      ? 'bg-[#231F20] text-[#FAF6F0] shadow-md scale-[1.02]'
                      : 'bg-[#F3ECE1] text-[#5A524C] hover:bg-[#E6DEC8] hover:text-[#231F20]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredMenu.map((dish) => {
              const name = lang === 'vi' ? dish.nameVi : dish.nameSk;
              const desc = lang === 'vi' ? dish.descVi : dish.descSk;
              const inCart = cart.find((c) => c.item.id === dish.id);

              return (
                <div
                  key={dish.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#E6DEC8] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Dish Image & Badges */}
                    <div className="relative h-56 overflow-hidden bg-[#231F20]">
                      <img
                        src={dish.image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Dish Code */}
                      <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-lg bg-[#231F20]/80 backdrop-blur-md text-white text-xs font-bold">
                        #{dish.code}
                      </span>

                      {/* Badges */}
                      <div className="absolute top-3.5 right-3.5 flex flex-col gap-1.5 items-end">
                        {dish.badge === 'bestseller' && (
                          <span className="px-3 py-1 rounded-full bg-[#C85A32] text-white text-xs font-semibold shadow">
                            ★ {t.menu.bestseller}
                          </span>
                        )}
                        {dish.spicy && (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-[11px] font-medium">
                            🌶 {t.menu.spicy}
                          </span>
                        )}
                        {dish.fresh && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#4A6B53]/90 text-white text-[11px] font-medium">
                            🌿 {t.menu.fresh}
                          </span>
                        )}
                      </div>

                      {/* Price Pill on Image Bottom Right */}
                      <div className="absolute bottom-3.5 right-3.5 px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-[#231F20] font-extrabold text-base shadow">
                        {dish.price.toFixed(2)} €
                      </div>
                    </div>

                    {/* Dish Details */}
                    <div className="p-6">
                      <h3 className="font-editorial text-2xl font-bold text-[#231F20] group-hover:text-[#C85A32] transition-colors">
                        {name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6E655F] mt-2 leading-relaxed line-clamp-3">
                        {desc}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-[#F3ECE1]">
                    <span className="text-xs text-[#8C827A] font-medium">
                      {dish.calories}
                    </span>

                    <button
                      onClick={() => addToCart(dish)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                        inCart
                          ? 'bg-[#4A6B53] text-white shadow-sm'
                          : 'bg-[#F3ECE1] hover:bg-[#C85A32] text-[#231F20] hover:text-white'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {t.menu.addToOrder}
                        {inCart ? ` (${inCart.quantity})` : ''}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          REVIEWS SECTION (4.7 ★ GOOGLE RATING)
      ========================================== */}
      <section id="reviews" className="py-16 bg-[#231F20] text-[#FAF6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D98A3C]">
                {t.reviews.tag}
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold mt-2">
                {t.reviews.title}
              </h2>
            </div>

            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 border border-white/15">
              <div className="flex items-center text-[#D98A3C]">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-[#D98A3C]" />
                ))}
              </div>
              <span className="text-sm font-semibold">{t.reviews.googleVerified}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-7 rounded-3xl bg-white/5 border border-white/10 hover:border-[#D98A3C]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-[#D98A3C]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#D98A3C]" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-white/20" />
                  </div>
                  <p className="text-sm sm:text-base text-[#E8DFD1] leading-relaxed">
                    "{lang === 'vi' ? rev.textVi : rev.textSk}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{rev.author}</span>
                  <span className="text-xs text-white/50">
                    {lang === 'vi' ? rev.dateVi : rev.dateSk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          BRANCH LOCATION & OPENING HOURS SECTION
      ========================================== */}
      <section id="location" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F3ECE1] rounded-[36px] p-6 sm:p-10 lg:p-12 border border-[#E2D6C3] shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Info Column */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C85A32]/15 text-[#C85A32] text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t.branchInfo.tag}</span>
                </div>

                <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#231F20]">
                  {t.branchInfo.title}
                </h2>

                <p className="text-[#5A524C] text-sm sm:text-base leading-relaxed">
                  {t.branchInfo.desc}
                </p>

                {/* Info Cards */}
                <div className="space-y-4 pt-2">
                  <div className="p-5 rounded-2xl bg-white border border-[#E5DEC9] flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#C85A32]/15 text-[#C85A32] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#8C827A]">
                        {t.branchInfo.addressLabel}
                      </div>
                      <div className="text-base sm:text-lg font-bold text-[#231F20] mt-0.5">
                        Pri jazere 1, 930 10 Dolný Štál, Slovakia
                      </div>
                      <div className="text-xs text-[#4A6B53] font-medium mt-1">
                        {t.branchInfo.parkingInfo}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#E5DEC9] flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#D98A3C]/15 text-[#D98A3C] flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#8C827A]">
                          {t.branchInfo.hoursLabel}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#4A6B53]/15 text-[#4A6B53]">
                          {isOpenNow ? t.hero.openStatus : t.hero.closedStatus}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1.5 text-sm">
                        <div className="flex justify-between font-medium text-[#231F20]">
                          <span>{t.branchInfo.monFri}</span>
                          <span className="font-bold">08:00 – 20:00</span>
                        </div>
                        <div className="flex justify-between font-medium text-[#231F20]">
                          <span>{t.branchInfo.satSun}</span>
                          <span className="font-bold">09:00 – 20:00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#E5DEC9] flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#4A6B53]/15 text-[#4A6B53] flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#8C827A]">
                        {t.branchInfo.phoneLabel}
                      </div>
                      <a
                        href="tel:+421940904899"
                        className="text-lg font-bold text-[#C85A32] hover:underline mt-0.5 block"
                      >
                        +421 940 904 899
                      </a>
                    </div>
                  </div>
                </div>

                {/* Action Links */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <a
                    href="https://www.google.com/maps/search/Pri+jazere+1,+930+10+Doln%C3%BD+%C5%A0t%C3%A1l"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#231F20] hover:bg-[#3A3436] text-white font-semibold text-sm transition-all shadow-md"
                  >
                    <Navigation className="w-4 h-4 text-[#D98A3C]" />
                    <span>{t.branchInfo.getDirections}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>

                  <a
                    href="tel:+421940904899"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#C85A32] hover:bg-[#B24B26] text-white font-semibold text-sm transition-all shadow-md"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t.branchInfo.callNow}</span>
                  </a>
                </div>
              </div>

              {/* Right Interactive Visual Map Preview Card */}
              <div className="lg:col-span-6">
                <div className="rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white relative">
                  <iframe
                    title="VietFood Reštaurácia Pri jazere 1 Dolný Štál Map"
                    src="https://www.google.com/maps?q=Pri+jazere+1,+930+10+Doln%C3%BD+%C5%A0t%C3%A1l,+Slovakia&output=embed"
                    className="w-full h-[400px] sm:h-[440px] border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="p-4 bg-white border-t border-[#E5DEC9] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-sm text-[#231F20]">
                        VietFood Reštaurácia – Dolný Štál
                      </div>
                      <div className="text-xs text-[#6E655F]">
                        Pri jazere 1, 930 10 Dolný Štál • 4.7 ★ Google Maps
                      </div>
                    </div>
                    <a
                      href="https://www.google.com/maps/search/2:+Pri+jazere+1,+930+10+Doln%C3%BD+%C5%A0t%C3%A1l"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-[#C85A32] hover:underline flex items-center gap-1"
                    >
                      <span>Google Maps</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FOOTER
      ========================================== */}
      <footer className="bg-[#1B1819] text-[#E8DFD1] py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C85A32] flex items-center justify-center text-white">
              <Soup className="w-5 h-5" />
            </div>
            <div>
              <div className="font-editorial text-xl font-bold text-white">
                VietFood Reštaurácia – Dolný Štál
              </div>
              <div className="text-xs text-white/60">
                Pri jazere 1, 930 10 Dolný Štál, Slovakia • Tel: +421 940 904 899
              </div>
            </div>
          </div>

          <div className="text-xs text-white/60 text-center sm:text-right">
            © {new Date().getFullYear()} VietFood Reštaurácia (Chi nhánh Dolný Štál). All rights reserved.
          </div>
        </div>
      </footer>

      {/* ==========================================
          MODAL 1: TAKEAWAY CART DRAWER
      ========================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FAF6F0] h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-6 bg-white border-b border-[#E5DEC9] flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#C85A32]" />
                <h3 className="font-editorial text-2xl font-bold text-[#231F20]">
                  {t.cart.title}
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl bg-[#F3ECE1] hover:bg-[#E5DEC9] text-[#231F20]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 flex-1 space-y-6">
              {orderSubmitted ? (
                <div className="p-6 rounded-3xl bg-white border border-[#4A6B53]/30 text-center space-y-4 my-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#4A6B53]/15 text-[#4A6B53] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-editorial text-2xl font-bold text-[#231F20]">
                    {t.cart.orderSuccessTitle}
                  </h4>
                  <p className="text-sm text-[#5A524C] leading-relaxed">
                    {t.cart.orderSuccessDesc}
                  </p>
                  <div className="p-3.5 rounded-xl bg-[#F3ECE1] text-xs font-semibold text-[#231F20]">
                    📍 Pri jazere 1, 930 10 Dolný Štál • 📞 +421 940 904 899
                  </div>
                  <button
                    onClick={() => {
                      setOrderSubmitted(false);
                      setIsCartOpen(false);
                    }}
                    className="w-full py-3 rounded-xl bg-[#231F20] text-white font-semibold text-sm"
                  >
                    OK
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-[#8C827A] mx-auto stroke-1" />
                  <p className="text-sm text-[#6E655F] max-w-xs mx-auto">
                    {t.cart.empty}
                  </p>
                </div>
              ) : (
                <>
                  {/* Items List */}
                  <div className="space-y-3">
                    {cart.map(({ item, quantity }) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-white border border-[#E5DEC9] flex items-center justify-between gap-3"
                      >
                        <img
                          src={item.image}
                          alt={item.nameVi}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-[#231F20] truncate">
                            {lang === 'vi' ? item.nameVi : item.nameSk}
                          </div>
                          <div className="text-xs text-[#C85A32] font-bold mt-0.5">
                            {(item.price * quantity).toFixed(2)} €
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-[#F3ECE1] rounded-xl p-1">
                          <button
                            onClick={() => updateCartQty(item.id, -1)}
                            className="p-1.5 rounded-lg hover:bg-white text-[#231F20]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold w-5 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.id, 1)}
                            className="p-1.5 rounded-lg hover:bg-white text-[#231F20]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pickup Info Banner */}
                  <div className="p-3.5 rounded-2xl bg-[#D98A3C]/15 border border-[#D98A3C]/30 text-xs text-[#231F20] font-medium">
                    🛍 {t.cart.pickupNote}
                  </div>

                  {/* Customer Takeaway Form */}
                  <form onSubmit={handleOrderSubmit} className="space-y-3 pt-2">
                    <input
                      type="text"
                      required
                      placeholder={t.cart.customerName}
                      value={orderForm.name}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DED2C1] text-sm focus:outline-none focus:border-[#C85A32]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder={t.cart.customerPhone}
                      value={orderForm.phone}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#DED2C1] text-sm focus:outline-none focus:border-[#C85A32]"
                    />
                    <textarea
                      rows={2}
                      placeholder={t.cart.orderNote}
                      value={orderForm.note}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, note: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DED2C1] text-sm focus:outline-none focus:border-[#C85A32]"
                    />

                    <div className="pt-3 border-t border-[#E5DEC9] flex items-center justify-between text-base font-bold text-[#231F20]">
                      <span>{t.cart.total}</span>
                      <span className="text-xl text-[#C85A32]">
                        {totalPrice.toFixed(2)} €
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-[#C85A32] hover:bg-[#B24B26] text-white font-bold text-sm shadow-lg shadow-[#C85A32]/25 transition-all"
                    >
                      {t.cart.submitOrder}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: TABLE RESERVATION
      ========================================== */}
      {isReserveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#FAF6F0] rounded-3xl shadow-2xl border border-[#E5DEC9] overflow-hidden">
            <div className="p-6 bg-white border-b border-[#E5DEC9] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#C85A32]">
                  Pri jazere 1 • Dolný Štál
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#231F20]">
                  {t.reservation.title}
                </h3>
              </div>
              <button
                onClick={() => setIsReserveOpen(false)}
                className="p-2 rounded-xl bg-[#F3ECE1] hover:bg-[#E5DEC9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {reserveSubmitted ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#4A6B53]/15 text-[#4A6B53] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-editorial text-2xl font-bold text-[#231F20]">
                    {t.reservation.successTitle}
                  </h4>
                  <p className="text-sm text-[#5A524C] max-w-sm mx-auto">
                    {t.reservation.successDesc}
                  </p>
                  <div className="p-3.5 rounded-xl bg-[#F3ECE1] text-xs font-semibold text-[#231F20]">
                    📅 {reserveForm.date} • ⏰ {reserveForm.time} • 👥 {reserveForm.guests}
                  </div>
                  <button
                    onClick={() => setIsReserveOpen(false)}
                    className="w-full py-3.5 rounded-xl bg-[#231F20] text-white font-semibold text-sm"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReserveSubmit} className="space-y-4">
                  <p className="text-xs sm:text-sm text-[#5A524C]">
                    {t.reservation.subtitle}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-semibold text-[#5A524C] block mb-1">
                        {t.reservation.name} *
                      </label>
                      <input
                        type="text"
                        required
                        value={reserveForm.name}
                        onChange={(e) =>
                          setReserveForm({ ...reserveForm, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DED2C1] text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#5A524C] block mb-1">
                        {t.reservation.phone} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={reserveForm.phone}
                        onChange={(e) =>
                          setReserveForm({ ...reserveForm, phone: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DED2C1] text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#5A524C] block mb-1">
                        {t.reservation.date}
                      </label>
                      <input
                        type="date"
                        value={reserveForm.date}
                        onChange={(e) =>
                          setReserveForm({ ...reserveForm, date: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DED2C1] text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#5A524C] block mb-1">
                        {t.reservation.time}
                      </label>
                      <select
                        value={reserveForm.time}
                        onChange={(e) =>
                          setReserveForm({ ...reserveForm, time: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DED2C1] text-sm"
                      >
                        <option>11:30</option>
                        <option>12:30</option>
                        <option>13:30</option>
                        <option>17:00</option>
                        <option>18:00</option>
                        <option>19:00</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#5A524C] block mb-1">
                        {t.reservation.guests}
                      </label>
                      <select
                        value={reserveForm.guests}
                        onChange={(e) =>
                          setReserveForm({ ...reserveForm, guests: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DED2C1] text-sm"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="6">6</option>
                        <option value="8+">8+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#5A524C] block mb-1">
                      {t.reservation.notes}
                    </label>
                    <textarea
                      rows={2}
                      value={reserveForm.notes}
                      onChange={(e) =>
                        setReserveForm({ ...reserveForm, notes: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DED2C1] text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-[#C85A32] hover:bg-[#B24B26] text-white font-bold text-sm shadow-lg shadow-[#C85A32]/25 transition-all"
                  >
                    {t.reservation.confirm}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}