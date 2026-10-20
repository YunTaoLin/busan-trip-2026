import { useEffect, useMemo, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Keyboard, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import './App.css'

type Attraction = {
  title: string
  category: string
  description: string
  details: string
  images: string[]
  mapQuery: string
}

type Stop = {
  id: string
  time: string
  title: string
  label: string
  note: string
  icon: string
  attraction?: Attraction
}

type DayPlan = {
  day: number
  date: string
  title: string
  subtitle: string
  highlight: string
  stops: Stop[]
}

type Transit = {
  from: string
  to: string
  mode: string
  duration: string
  detail: string
  tip: string
  mapQuery: string
}

const image = (source: string) =>
  source.startsWith('http')
    ? source
    : `https://images.unsplash.com/${source}?auto=format&fit=crop&w=1200&q=85`

const attractions: Record<string, Attraction> = {
  airport: {
    title: '金海機場',
    category: '抵達釜山的第一站',
    description: '抵達釜山後先不用急著趕行程，領完行李、換匯，再把 T-money 儲值好，接下來五天就可以輕鬆上路。',
    details: '機場輕軌可在沙上站轉乘釜山地鐵 2 號線。第一次來釜山，建議預留換匯與確認交通卡的時間。',
    images: [
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Gimhae_Airport_lightrail_terminal.jpg/1280px-Gimhae_Airport_lightrail_terminal.jpg'),
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Gimhae_International_Airport.jpg/1280px-Gimhae_International_Airport.jpg'),
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/Light_Rail_Gimhae_Int%27l_Airport_02.JPG/1280px-Light_Rail_Gimhae_Int%27l_Airport_02.JPG'),
    ],
    mapQuery: 'Gimhae International Airport',
  },
  jeonpo: {
    title: '田浦咖啡街',
    category: 'Coffee & slow morning',
    description: '藏在西面旁的田浦咖啡街，有老工廠改造的咖啡館、選物店和舒服的街角。先用一杯咖啡把旅行速度調慢。',
    details: '巷弄店家距離不遠，適合散步探索；週末熱門咖啡廳可能需要候位，早午餐建議保留彈性。',
    images: [image('photo-1495474472287-4d71bcdd2085'), image('photo-1511081692775-05d0f180a065'), image('photo-1517248135467-4c7edcad34c4')],
    mapQuery: 'Jeonpo Cafe Street Busan',
  },
  seomyeon: {
    title: '西面地下街 & 樂天百貨',
    category: '室內逛街補給',
    description: '釜山最熱鬧的生活圈之一，地下街、百貨、藥妝和美食一次收服。午後吹冷氣、慢慢逛，剛好接上入住時間。',
    details: '西面站地下街出口很多，先記住回程出口；百貨與地下街之間可以依體力自由切換。',
    images: [image('photo-1441986300917-64674bd600d8'), image('photo-1555529669-e69e7aa0ba9a'), image('photo-1483985988355-763728e1935b')],
    mapQuery: 'Seomyeon Busan',
  },
  gamcheon: {
    title: '甘川洞文化村',
    category: '彩色山城散步',
    description: '沿著山坡展開的彩色房子和小巷，是釜山最經典的風景。找小王子、看海景，也別忘了留一點時間給沿路的小店。',
    details: '坡道多、建議穿好走的鞋。村內拍照點分散，依現場人潮調整路線會比追完所有地圖更舒服。',
    images: [
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Colorful_houses_in_Gamcheon_Culture_Village_at_sunset_in_Busan_South_Korea.jpg/1280px-Colorful_houses_in_Gamcheon_Culture_Village_at_sunset_in_Busan_South_Korea.jpg'),
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Gamcheon_Culture_Village.jpg/1280px-Gamcheon_Culture_Village.jpg'),
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Gamcheon_Culture_Village_in_Busan%2C_South_Korea.jpg/1280px-Gamcheon_Culture_Village_in_Busan%2C_South_Korea.jpg'),
    ],
    mapQuery: 'Gamcheon Culture Village Busan',
  },
  jagalchi: {
    title: '札嘎其市場 & BIFF 廣場',
    category: '海鮮與街頭小吃',
    description: '中午來到南浦洞一帶，先吃一輪新鮮海鮮，再到 BIFF 廣場找香甜酥脆的黑糖堅果餅。',
    details: '市場攤位選擇很多，可以先繞一圈比較；BIFF 廣場就在附近，適合邊走邊吃。',
    images: [
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Jagalchi_Market_01.jpg/1280px-Jagalchi_Market_01.jpg'),
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Jagalchi_Market_02.jpg/1280px-Jagalchi_Market_02.jpg'),
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Jagalchi_Market_20200523_018.jpg/1280px-Jagalchi_Market_20200523_018.jpg'),
    ],
    mapQuery: 'Jagalchi Market Busan',
  },
  nampo: {
    title: '南浦洞商圈',
    category: '光復路與百貨散步',
    description: '從札嘎其一路逛到南浦洞，光復路、百貨與巷弄小吃都集中在這裡，適合把下午留給慢慢探索。',
    details: '南浦洞商圈店家密集，建議先確認想逛的百貨與光復路方向；最後可以在附近找晚餐。',
    images: [
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Busan-subway-111-Nampo-dong-station-2-entrance.jpg/1280px-Busan-subway-111-Nampo-dong-station-2-entrance.jpg'),
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Busan-subway-111-Nampo-dong-station-platform.jpg/1280px-Busan-subway-111-Nampo-dong-station-platform.jpg'),
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Food_alley_in_Nampo-dong%2C_Busan_in_2003.jpg/1280px-Food_alley_in_Nampo-dong%2C_Busan_in_2003.jpg'),
    ],
    mapQuery: 'Nampo-dong Busan',
  },
  songdo: {
    title: '松島海上纜車 & 龍宮雲橋',
    category: '海上風景線',
    description: '搭著纜車越過湛藍海面，再到龍宮雲橋看海浪拍岸，這段是 VBP 48H 的第一個大亮點。',
    details: '午後海風舒服但日照較強，建議先確認纜車排隊狀況；透明車廂視線很棒，怕高也可以選一般車廂。',
    images: [
      image('https://live.staticflickr.com/65535/52557288551_7bfee7c9de_b.jpg'),
      image('https://live.staticflickr.com/65535/52557755970_2bcda710df_b.jpg'),
      image('https://live.staticflickr.com/4891/31824085488_b7fd32ce49_b.jpg'),
    ],
    mapQuery: 'Songdo Cable Car Busan',
  },
  busantower: {
    title: '釜山塔',
    category: '夕陽與城市夜景',
    description: '登上龍頭山公園的釜山塔，從高處把南浦洞和港口收進眼底，夕陽後的藍調時刻尤其迷人。',
    details: '可以先在龍頭山公園散步再上塔；日落前抵達能同時看到白天、夕陽與亮燈後的城市。',
    images: [image('photo-1477959858617-67f85cf4f1df'), image('photo-1519501025264-65ba15a82390'), image('photo-1473445361085-b9a07f55608b')],
    mapQuery: 'Busan Tower',
  },
  lotteworld: {
    title: '樂天世界 釜山',
    category: '換校服大玩特玩',
    description: '把童心留給大型主題樂園：換上校服、搭設施、拍城堡，這天的快樂請直接開到最大。',
    details: '園區範圍大，建議先排想玩的設施；VBP 票券與入園規則出發前再確認一次。',
    images: [
      image('https://upload.wikimedia.org/wikipedia/commons/9/95/Giant_Digger%2C_Lotte_World_Adventure_Busan%2C_c._June_2022%2C.jpg'),
      image('https://live.staticflickr.com/1370/882297516_772219e5f5_b.jpg'),
      image('https://live.staticflickr.com/3760/11964616055_54fa898b37_b.jpg'),
    ],
    mapQuery: 'Lotte World Adventure Busan',
  },
  luge: {
    title: 'Skyline Luge 釜山',
    category: '沿海飆車',
    description: '沿著山坡一路滑下去，速度感和海景一次擁有。從樂園順路接過來，剛好把午後玩樂延續下去。',
    details: '依現場人潮安排圈數；建議穿著包覆性較好的鞋子，長髮記得綁好。',
    images: [
      image('https://live.staticflickr.com/7327/27445947910_5cab58d232_b.jpg'),
      image('https://loremflickr.com/1200/800/skyline,luge,korea?lock=2'),
      image('https://loremflickr.com/1200/800/luge,track,korea?lock=3'),
    ],
    mapQuery: 'Skyline Luge Busan',
  },
  yonggungsa: {
    title: '海東龍宮寺',
    category: '海邊懸崖寺廟',
    description: '坐落在海岸線上的寺廟，石階、浪花和夕陽交織成很安靜的風景，是釜山旅程裡最療癒的一段。',
    details: '寺院階梯較多，請穿防滑鞋；傍晚光線柔和，記得留意最後入場時間。',
    images: [image('photo-1548013146-72479768bada'), image('photo-1470252649378-9c29740c9fa8'), image('photo-1500534623283-312aade485b7')],
    mapQuery: 'Haedong Yonggungsa Temple Busan',
  },
  gwangan: {
    title: '廣安里夜景',
    category: '入住海景收尾',
    description: '回到 Homers 放好戰利品，沿著廣安里海邊散步，看廣安大橋亮起來，再找一間舒服的酒吧或居酒屋。',
    details: '海邊風較大，晚餐後沿沙灘或海岸步道慢慢走即可；酒吧座位熱門，想坐窗邊可以提早入店。',
    images: [
      image('https://upload.wikimedia.org/wikipedia/commons/d/da/Busan_Gwangalli_Night.jpg'),
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Gwangalli_Beach_and_Gwangan_Bridge_Busan.jpg/1280px-Gwangalli_Beach_and_Gwangan_Bridge_Busan.jpg'),
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Gwangalli_Beach_in_Busan.jpg/1280px-Gwangalli_Beach_in_Busan.jpg'),
    ],
    mapQuery: 'Gwangalli Beach Busan',
  },
  blueline: {
    title: '海雲台海邊小火車',
    category: '必搭海岸列車',
    description: '坐在海岸線旁的小火車，看列車窗外的藍色海面一路展開。早上人潮還沒完全湧入，最適合悠閒出發。',
    details: '建議事先預約指定時段；若遇到候補或滿席，可以改搭海岸膠囊列車或沿線步行。',
    images: [
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Sky_Capsule_train_at_Haeundae_Blueline_Park%2C_Busan.jpg/1280px-Sky_Capsule_train_at_Haeundae_Blueline_Park%2C_Busan.jpg'),
      image('https://live.staticflickr.com/65535/54244741282_120defb136_b.jpg'),
      image('https://live.staticflickr.com/65535/54246061680_a15d415553_b.jpg'),
    ],
    mapQuery: 'Haeundae Blueline Park Mipo Station',
  },
  xthesky: {
    title: 'Busan X the Sky',
    category: '100 樓海景',
    description: '站上釜山最高觀景台，從 100 樓俯瞰海雲台與城市天際線，天氣好時視野非常開闊。',
    details: '觀景台內有咖啡廳和拍照點，玻璃地板區域可以依膽量挑戰；建議預留完整一小時。',
    images: [
      image('https://live.staticflickr.com/65535/54234325727_ea41fe2ab3_b.jpg'),
      image('https://live.staticflickr.com/65535/54244399165_1058fd264d_b.jpg'),
      image('https://live.staticflickr.com/65535/54244218129_d058403256_b.jpg'),
    ],
    mapQuery: 'Busan X the Sky',
  },
  spa: {
    title: 'Spa Land 汗蒸幕',
    category: '旅程的深呼吸',
    description: '把下午留給溫熱的湯池、汗蒸房和休息區。這是 VBP 終極壓線，也是把雙腳充回電的完美安排。',
    details: '館內分男女湯區，入場後可依指示使用；自備保養品或在館內補水，待好待滿再出發。',
    images: [
      image('https://loremflickr.com/1200/800/spa,sauna,korea?lock=1'),
      image('https://loremflickr.com/1200/800/spa,sauna,interior?lock=2'),
      image('https://loremflickr.com/1200/800/spa,relaxation?lock=3'),
    ],
    mapQuery: 'Spa Land Centum City Busan',
  },
  clubd: {
    title: 'Club D Oasis',
    category: '海景 Spa・汗蒸幕',
    description: '把 VBP 的最後一站留給海景 Spa 和汗蒸幕，不排 Water Park 全套，舒服泡到晚上再去海雲台吃飯。',
    details: '本次以 Spa 為主，請事先確認 VBP 兌換規則與入場時間；從 X the Sky 前往約需預留交通時間。',
    images: [
      image('https://loremflickr.com/1200/800/oasis,spa,sea?lock=1'),
      image('https://loremflickr.com/1200/800/sauna,sea,korea?lock=2'),
      image('https://loremflickr.com/1200/800/spa,coast,korea?lock=3'),
    ],
    mapQuery: 'Club D Oasis Busan',
  },
  huinnyeoul: {
    title: '白淺灘文化村',
    category: '海景咖啡放空',
    description: '沿著絕壁海岸散步，找一間面海咖啡廳坐下來，讓最後一天保留一點什麼都不趕的空白。',
    details: '巷道與坡道交錯，建議穿好走的鞋；咖啡廳座位面向海景，熱門時段可能需要等候。',
    images: [
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Cafe_in_Huinnyeoul_Culture_Village.jpg/1280px-Cafe_in_Huinnyeoul_Culture_Village.jpg'),
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Guide_sign_of_Huinnyeoul_Culture_Village.jpg/1280px-Guide_sign_of_Huinnyeoul_Culture_Village.jpg'),
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/Huinnyeoul_Culture_Village.jpg/1280px-Huinnyeoul_Culture_Village.jpg'),
    ],
    mapQuery: 'Huinnyeoul Culture Village Busan',
  },
  lottegwangbok: {
    title: '樂天百貨光復店',
    category: '最後大掃貨',
    description: '室內噴泉秀、百貨和超市一次完成，伴手禮最後補齊，帶著滿滿戰利品去機場。',
    details: '地下超市適合集中採買零食與伴手禮；噴泉秀時間依現場公告，購物前可以先確認。',
    images: [
      image('https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Lotte_Mall_Busan_Gwangbok_Store.jpg/1280px-Lotte_Mall_Busan_Gwangbok_Store.jpg'),
      image('https://live.staticflickr.com/3760/11964616055_54fa898b37_b.jpg'),
      image('https://live.staticflickr.com/5487/11964617045_c008cdf4b8_b.jpg'),
    ],
    mapQuery: 'Lotte Department Store Gwangbok Busan',
  },
}

const makeStop = (id: string, time: string, title: string, label: string, note: string, icon: string, attractionKey?: string): Stop => ({
  id,
  time,
  title,
  label,
  note,
  icon,
  attraction: attractionKey ? attractions[attractionKey] : undefined,
})

const days: DayPlan[] = [
  {
    day: 1,
    date: 'Day 01',
    title: '金海機場到西面',
    subtitle: '甘川洞・南浦洞・西面',
    highlight: '抵達後一路往南浦洞，再回西面入住',
    stops: [
      makeStop('airport', '07:00', '金海機場', '抵達', '領行李、換匯、儲值 T-money', '✈', 'airport'),
      makeStop('gemstay', '09:30', '西面 Gemstay', '寄放行李', '先放下行李，輕裝出發', '⌂'),
      makeStop('gamcheon', '10:30–12:30', '甘川洞文化村', '山城散步', '找小王子、拍照，慢慢逛彩色山城', '🎨', 'gamcheon'),
      makeStop('jagalchi', '13:00–14:00', '札嘎其市場／BIFF 廣場', '午餐・市場', '午餐、逛市場與 BIFF 廣場', '🦐', 'jagalchi'),
      makeStop('nampo', '14:00–17:00', '南浦洞商圈', '光復路・百貨', '光復路、樂天百貨，自由逛街', '🛍', 'nampo'),
      makeStop('checkin', '17:30', '回西面飯店 Check-in', '入住休息', '回飯店放行李、洗澡休息', '🛏'),
      makeStop('dwaeji', '18:30–20:00', '西面晚餐：豬肉湯飯', '晚餐', '釜山第一晚，吃一碗熱呼呼湯飯', '🍲'),
      makeStop('seomyeon-night', '晚上', '西面自由活動', '休息', '附近散步、採買，早點休息', '🌙'),
    ],
  },
  {
    day: 2,
    date: 'Day 02',
    title: '松島到海雲台',
    subtitle: 'VBP 48H・X the Sky・Club D Oasis',
    highlight: '11:00 啟用 VISIT BUSAN PASS 48H',
    stops: [
      makeStop('breakfast', '09:00', '起床、早餐', '慢慢出發', '睡飽吃早餐，準備迎接 VBP 第一日', '☀'),
      makeStop('songdo', '10:00', '前往松島', '移動', '前往松島海邊，11:00 準時開通 VBP', '🚕'),
      makeStop('songdo-visit', '11:00–13:00', '松島海上纜車 & 龍宮雲橋', 'VBP 48H 開通', '松島海上纜車、龍宮雲橋，VBP 從 11:00 開始使用', '🚡', 'songdo'),
      makeStop('haeundae-lunch', '13:00–14:30', '午餐＋前往海雲台', '簡單吃', '午餐不要排太久，把時間留給下午景點', '🍜'),
      makeStop('blueline', '15:00–16:30', '海雲台海岸列車', 'VBP', '搭海岸列車，看沿線海景', '🚃', 'blueline'),
      makeStop('xthesky', '16:30–19:00', 'Busan X the Sky', 'VBP', '白天景色 → 夕陽 → 夜景', '🔭', 'xthesky'),
      makeStop('clubd', '19:00–21:15', 'Club D Oasis Spa', 'VBP', '海景 Spa／汗蒸幕；這次以 Spa 為主', '♨', 'clubd'),
      makeStop('haeundae-dinner', '21:15–22:30', '海雲台晚餐', '晚餐', '烤肉／河豚料理／湯飯', '🍽'),
      makeStop('return-seomyeon', '22:30～', '回西面', '返回飯店', '搭車回西面休息', '🌙'),
    ],
  },
  {
    day: 3,
    date: 'Day 03',
    title: '東釜山玩樂購物日',
    subtitle: 'Lotte World・Skyline Luge・Outlet',
    highlight: 'VBP 使用強度最高的一天',
    stops: [
      makeStop('checkout', '09:00', '起床、整理行李', '準備退房', '整理行李，準備前往廣安里', '🧳'),
      makeStop('homers-drop', '10:20', '退房 & 前往廣安里 Homers', '寄放行李', '到 Homers 寄放行李，輕裝出發', '⌂'),
      makeStop('lotteworld', '11:30–15:30', 'Lotte World Busan', 'VBP・4 小時', '換校服，大玩特玩；保留完整 4 小時', '🎢', 'lotteworld'),
      makeStop('luge', '16:00–17:30', 'Skyline Luge Busan', 'VBP', '從樂園順路飆車', '🏎', 'luge'),
      makeStop('outlet', '18:00–20:30', '東釜山 Outlet', '購物・晚餐', '樂天名牌折扣購物中心，順便吃晚餐', '👛'),
      makeStop('gwangan', '20:30～', '回廣安里', '返回海邊', '回到廣安里，慢慢收尾', '🌉', 'gwangan'),
      makeStop('homers-checkin', '22:00', 'Homers Check-in', '入住', '入住後享受廣安里海景', '🛏'),
    ],
  },
  {
    day: 4,
    date: 'Day 04',
    title: 'Spa Land 最後壓線',
    subtitle: 'Centum City・新世界・廣安里',
    highlight: '11:00 前完成 VBP 入場／兌換',
    stops: [
      makeStop('day4-breakfast', '09:00', '起床、早餐', '慢慢出發', '吃完早餐前往 Centum City', '☀'),
      makeStop('centum', '10:00', '前往 Centum City', '移動', '提早抵達，準備 11:00 前完成入場', '🚇'),
      makeStop('spa', '10:30–13:00', 'Spa Land', 'VBP 最後壓線', '最重要：11:00 前完成入場／兌換，待好待滿', '♨', 'spa'),
      makeStop('centum-lunch', '13:00–14:00', '午餐', '簡單吃', '在 Centum City 附近補充體力', '🍜'),
      makeStop('shinsegae', '14:00–19:00', '新世界百貨 Centum City', '購物', '百貨、Centum City 逛街，慢慢買', '🛒'),
      makeStop('gwangan-dinner', '20:00–21:30', '廣安里晚餐', '晚餐・夜景', '吃飯後看廣安大橋夜景', '🍶', 'gwangan'),
      makeStop('gwangan-rest', '晚上', '回 Homers 休息', '入住', '把最後一晚留給海景與休息', '🌙'),
    ],
  },
  {
    day: 5,
    date: 'Day 05',
    title: '最後的海景與伴手禮',
    subtitle: '白淺文化村・南浦洞・金海機場',
    highlight: '慢慢告別，22:00 班機',
    stops: [
      makeStop('morning', '09:00', '起床、整理行李', '準備退房', '收好行李，享受最後一個釜山早晨', '🌤'),
      makeStop('homers-checkout', '10:20', 'Homers 退房', '退房', '退房後前往白淺文化村', '🧳'),
      makeStop('huinnyeoul', '11:30–14:00', '白淺文化村', '海景・咖啡', '海景、咖啡廳、拍照與最後散步', '🌊', 'huinnyeoul'),
      makeStop('nampo-last', '14:00–15:00', '前往南浦洞', '移動', '沿影島方向回到南浦洞', '🚕'),
      makeStop('lottegwangbok', '15:00–17:30', '樂天百貨光復店＋樂天超市', '最後採買', '買伴手禮，把最後戰利品補齊', '🎁', 'lottegwangbok'),
      makeStop('last-dinner', '18:00–19:00', '最後晚餐', '晚餐', '在南浦洞附近吃完最後一餐', '🍽'),
      makeStop('airport-go', '19:30', '前往金海機場', '返程', '搭乘輕軌，預留退稅與安檢時間', '🚝'),
      makeStop('flight', '22:00', '班機起飛', '回家', '滿載而歸，下次釜山見', '✈'),
    ],
  },
]

const transitRoutes: Record<string, Transit> = {
  'airport-gemstay': { from: '金海機場', to: '西面 Gemstay', mode: '輕軌＋地鐵', duration: '約 50–60 分鐘', detail: '搭釜山金海輕軌至沙上站，再轉釜山地鐵 2 號線至西面站。', tip: '機場先買／儲值 T-money，沙上站轉乘時跟著英文指標走即可。', mapQuery: 'Gimhae International Airport to Seomyeon Station Busan' },
  'gemstay-gamcheon': { from: '西面 Gemstay', to: '甘川洞文化村', mode: '地鐵＋公車', duration: '約 35–45 分鐘', detail: '搭地鐵 1 號線至土城站，再轉社區公車上山到甘川洞文化村。', tip: '山城公車彎道多，抵達後先在入口附近確認回程站牌。', mapQuery: 'Seomyeon Station to Gamcheon Culture Village Busan' },
  'gamcheon-jagalchi': { from: '甘川洞文化村', to: '札嘎其市場／BIFF 廣場', mode: '公車／地鐵', duration: '約 25–35 分鐘', detail: '搭社區公車下山至土城站一帶，再轉地鐵 1 號線至札嘎其站。', tip: '下山後先補水，再沿札嘎其市場與 BIFF 廣場步行探索。', mapQuery: 'Gamcheon Culture Village to Jagalchi Market Busan' },
  'jagalchi-nampo': { from: '札嘎其市場／BIFF 廣場', to: '南浦洞商圈', mode: '步行', duration: '約 10–15 分鐘', detail: '沿 BIFF 廣場、光復路一路步行即可抵達南浦洞商圈。', tip: '沿途店家很多，預留時間給臨時想逛的小店。', mapQuery: 'BIFF Square to Nampo-dong Busan' },
  'nampo-checkin': { from: '南浦洞商圈', to: '西面飯店', mode: '地鐵', duration: '約 25–30 分鐘', detail: '從南浦站搭地鐵 1 號線至西面，再步行回 Gemstay。', tip: '傍晚商圈人潮較多，回程先確認西面出口。', mapQuery: 'Nampo Station to Seomyeon Station Busan' },
  'checkin-dwaeji': { from: '西面飯店', to: '西面豬肉湯飯', mode: '步行', duration: '約 5–15 分鐘', detail: '西面商圈豬肉湯飯店家集中，從飯店步行挑選即可。', tip: '晚餐熱門店可能需要候位，看到想吃的就先抽號碼牌。', mapQuery: 'Pork soup rice Seomyeon Busan' },
  'dwaeji-seomyeon-night': { from: '西面豬肉湯飯', to: '西面自由活動', mode: '步行', duration: '約 5–10 分鐘', detail: '晚餐後留在西面商圈散步、採買，最後步行回飯店。', tip: '第一天不必排太滿，早點休息留體力給明天的 VBP 行程。', mapQuery: 'Seomyeon Busan night shopping' },
  'breakfast-songdo': { from: '早餐', to: '松島', mode: '地鐵＋公車／計程車', duration: '約 25–35 分鐘', detail: '從西面往南浦洞方向移動，再轉乘前往松島的公車；同行人數多可搭短程計程車。', tip: '10:00 出發、11:00 啟用 VBP，建議預留找入口與排隊時間。', mapQuery: 'Seomyeon to Songdo Cable Car Busan' },
  'songdo-songdo-visit': { from: '前往松島', to: '松島海上纜車 & 龍宮雲橋', mode: '步行', duration: '約 5–10 分鐘', detail: '抵達松島後步行前往纜車售票／兌換區，11:00 開始使用 VBP。', tip: '先確認纜車與龍宮雲橋的入場順序，避免錯過預約時段。', mapQuery: 'Songdo Cable Car Busan' },
  'songdo-visit-haeundae-lunch': { from: '松島', to: '午餐＋海雲台', mode: '計程車／公車', duration: '約 45–60 分鐘', detail: '松島到海雲台距離較遠，午餐建議選沿線或海雲台附近的簡單餐食。', tip: '不要排太久的午餐，把時間留給 15:00 海岸列車。', mapQuery: 'Songdo Cable Car to Haeundae Beach Busan' },
  'haeundae-lunch-blueline': { from: '午餐＋前往海雲台', to: '海雲台海岸列車', mode: '步行／計程車', duration: '約 10–15 分鐘', detail: '前往海雲台海岸列車尾浦站或指定搭乘站，依預約時段提早抵達。', tip: '海岸列車需留意指定時段，建議提前 10 分鐘報到。', mapQuery: 'Haeundae Beach to Haeundae Blueline Park Mipo Station' },
  'blueline-xthesky': { from: '海雲台海岸列車', to: 'Busan X the Sky', mode: '步行', duration: '約 10–15 分鐘', detail: '在尾浦站附近下車後，沿海雲台海邊步行至 LCT Tower。', tip: '沿路海景很漂亮，直接把移動也當成景點。', mapQuery: 'Haeundae Blueline Park Mipo Station to Busan X the Sky' },
  'xthesky-clubd': { from: 'Busan X the Sky', to: 'Club D Oasis', mode: '步行', duration: '約 5–10 分鐘', detail: 'Club D Oasis 位於海雲台 LCT 一帶，從 X the Sky 步行前往最方便。', tip: '預留入場／兌換時間，這站以 Spa 為主、不排 Water Park 全套。', mapQuery: 'Busan X the Sky to Club D Oasis Busan' },
  'clubd-haeundae-dinner': { from: 'Club D Oasis', to: '海雲台晚餐', mode: '步行', duration: '約 5–15 分鐘', detail: 'Spa 後留在海雲台商圈用餐，烤肉、河豚料理與湯飯都方便選擇。', tip: '泡湯後補充水分，再慢慢找晚餐。', mapQuery: 'Haeundae Busan dinner' },
  'haeundae-dinner-return-seomyeon': { from: '海雲台晚餐', to: '西面', mode: '地鐵', duration: '約 35–45 分鐘', detail: '從海雲台站搭釜山地鐵 2 號線往西側至西面站。', tip: '晚間回程仍有車，但請確認最後班次與飯店入口。', mapQuery: 'Haeundae Station to Seomyeon Station Busan' },
  'gemstay-jeonpo': { from: '西面 Gemstay', to: '田浦咖啡街', mode: '步行', duration: '約 10–15 分鐘', detail: '從西面站往田浦方向散步，巷弄咖啡廳集中在田浦咖啡街一帶。', tip: '早上街道安靜，適合邊走邊找想坐的店。', mapQuery: 'Seomyeon Station to Jeonpo Cafe Street Busan' },
  'jeonpo-noodles': { from: '田浦咖啡街', to: '小麥冷麵／刀削麵', mode: '步行＋地鐵', duration: '約 15–25 分鐘', detail: '依實際選定的餐廳位置，可步行回西面商圈或搭一站地鐵。', tip: '午餐店熱門，建議先在地圖上確認候位狀況。', mapQuery: 'Jeonpo Cafe Street to Seomyeon Busan' },
  'noodles-seomyeon': { from: '午餐', to: '西面地下街', mode: '步行', duration: '約 5–10 分鐘', detail: '西面地下街與餐廳集中區相連，沿著地下街指標前進即可。', tip: '地下街出口多，逛街前先記好回飯店的出口。', mapQuery: 'Seomyeon Underground Shopping Center Busan' },
  'jagalchi-songdo': { from: '札嘎其市場', to: '松島海上纜車', mode: '公車／計程車', duration: '約 20–30 分鐘', detail: '從札嘎其一帶搭公車前往松島，若同行人數較多，短程計程車更省力。', tip: '纜車熱門時段可能排隊，抵達後先確認回程節奏。', mapQuery: 'Jagalchi Market to Songdo Cable Car Busan' },
  'songdo-busantower': { from: '松島海上纜車', to: '釜山塔', mode: '計程車＋步行', duration: '約 25–30 分鐘', detail: '搭車回南浦洞，在龍頭山公園附近下車，再步行上坡至釜山塔。', tip: '夕陽前抵達最剛好，留意公園坡道與階梯。', mapQuery: 'Songdo Cable Car to Busan Tower' },
  'checkout-homers-drop': { from: '整理行李', to: '廣安里 Homers', mode: '步行／計程車', duration: '約 10–20 分鐘', detail: '整理行李後前往 Homers 寄放行李，依前一晚住宿位置選擇步行或短程計程車。', tip: '先把 VBP 與隨身物品整理好，寄放後直接前往東釜山。', mapQuery: 'Gwangalli Beach to Homers Hotel Busan' },
  'homers-drop-lotteworld': { from: '廣安里 Homers', to: 'Lotte World Busan', mode: '地鐵＋步行', duration: '約 55–70 分鐘', detail: '搭地鐵 2 號線往東側，再依 Osiria／主題樂園指標轉乘或步行。', tip: '早上先寄放行李再出發，園區內盡量減少隨身物品。', mapQuery: 'Gwangalli Beach to Lotte World Adventure Busan' },
  'lotteworld-luge': { from: '樂天世界 釜山', to: 'Skyline Luge 釜山', mode: '計程車／接駁', duration: '約 10–15 分鐘', detail: '兩個景點位於 Osiria 觀光區，短程搭車最省時間。', tip: '依現場排隊狀況調整圈數，替傍晚寺廟保留體力。', mapQuery: 'Lotte World Adventure Busan to Skyline Luge Busan' },
  'luge-outlet': { from: 'Skyline Luge Busan', to: '東釜山 Outlet', mode: '計程車／步行', duration: '約 5–10 分鐘', detail: '兩個景點位於 Osiria 觀光區，短程移動即可抵達折扣購物中心。', tip: '保留完整購物與晚餐時間，不再安排海東龍宮寺。', mapQuery: 'Skyline Luge Busan to Lotte Premium Outlet Busan' },
  'outlet-gwangan': { from: '東釜山 Outlet', to: '廣安里', mode: '地鐵／計程車', duration: '約 45–60 分鐘', detail: '從 Osiria 往西返回廣安里，購物後搭地鐵或計程車回 Homers。', tip: 'Outlet 關門前確認回程路線，晚間以計程車最省力。', mapQuery: 'Lotte Premium Outlet Busan to Gwangalli Beach' },
  'gwangan-homers-checkin': { from: '廣安里', to: 'Homers Check-in', mode: '步行', duration: '約 5–10 分鐘', detail: '抵達廣安里後步行回 Homers 辦理入住。', tip: '先把戰利品放回房間，再到海邊散步。', mapQuery: 'Gwangalli Beach to Homers Hotel Busan' },
  'day4-breakfast-centum': { from: '早餐', to: 'Centum City', mode: '地鐵', duration: '約 25–35 分鐘', detail: '搭地鐵 2 號線至 Centum City 站，提早抵達 Spa Land。', tip: '今天 VBP 最後壓線，請把 11:00 前入場當成第一優先。', mapQuery: 'Gwangalli Beach to Centum City Station Busan' },
  'centum-spa': { from: 'Centum City', to: 'Spa Land', mode: '步行', duration: '約 5–10 分鐘', detail: '從 Centum City 站依新世界百貨指標前往 Spa Land。', tip: '最重要：11:00 前完成 VBP 入場／兌換。', mapQuery: 'Centum City Station to Spa Land Busan' },
  'spa-centum-lunch': { from: 'Spa Land', to: 'Centum City 午餐', mode: '館內步行', duration: '約 5–10 分鐘', detail: 'Spa Land 位於新世界百貨內，出來後直接在 Centum City 用餐。', tip: '泡湯後先補充水分，再開始下午逛街。', mapQuery: 'Shinsegae Centum City food court Busan' },
  'centum-lunch-shinsegae': { from: 'Centum City 午餐', to: '新世界百貨 Centum City', mode: '館內步行', duration: '約 5 分鐘', detail: '午餐後留在百貨與 Centum City 逛街即可。', tip: '逛街時間充裕，可以依照體力自由安排樓層。', mapQuery: 'Shinsegae Centum City Busan' },
  'shinsegae-gwangan-dinner': { from: '新世界百貨 Centum City', to: '廣安里晚餐', mode: '地鐵', duration: '約 25–35 分鐘', detail: '搭地鐵 2 號線返回廣安里，再沿海邊找晚餐。', tip: '晚餐後直接看廣安大橋夜景，不必再安排其他景點。', mapQuery: 'Centum City Station to Gwangan Station Busan' },
  'gwangan-dinner-gwangan-rest': { from: '廣安里晚餐', to: 'Homers', mode: '步行', duration: '約 5–15 分鐘', detail: '晚餐後沿廣安里海邊散步回 Homers。', tip: '把最後一晚留給海景與休息。', mapQuery: 'Gwangalli Beach to Homers Hotel Busan' },
  'morning-homers-checkout': { from: '整理行李', to: 'Homers 退房', mode: '飯店內', duration: '約 10–20 分鐘', detail: '整理完行李後在 Homers 辦理退房，接著前往白淺文化村。', tip: '確認護照、機票與伴手禮都已收好。', mapQuery: 'Homers Hotel Busan' },
  'homers-checkout-huinnyeoul': { from: 'Homers 退房', to: '白淺文化村', mode: '公車／計程車', duration: '約 35–50 分鐘', detail: '從廣安里往影島方向移動，帶行李時先確認寄放安排。', tip: '影島坡道較多，穿舒服的鞋，留足咖啡廳放空時間。', mapQuery: 'Gwangalli Beach to Huinnyeoul Culture Village' },
  'huinnyeoul-nampo-last': { from: '白淺文化村', to: '南浦洞', mode: '公車／計程車', duration: '約 20–30 分鐘', detail: '沿影島往南浦洞移動，接著開始最後採買。', tip: '若攜帶戰利品較多，短程計程車會更方便。', mapQuery: 'Huinnyeoul Culture Village to Nampo-dong Busan' },
  'nampo-last-lottegwangbok': { from: '南浦洞', to: '樂天百貨光復店', mode: '步行', duration: '約 5–10 分鐘', detail: '南浦洞商圈與樂天百貨光復店相鄰，步行即可抵達。', tip: '先看噴泉秀時間，再到地下超市集中採買伴手禮。', mapQuery: 'Nampo-dong to Lotte Department Store Gwangbok' },
  'lottegwangbok-last-dinner': { from: '樂天百貨光復店', to: '最後晚餐', mode: '步行', duration: '約 5–15 分鐘', detail: '留在南浦洞附近找最後一餐，吃完直接前往機場。', tip: '確認退稅、行李與機場交通後再入座。', mapQuery: 'Nampo-dong Busan dinner' },
  'last-dinner-airport-go': { from: '最後晚餐', to: '金海機場', mode: '地鐵＋輕軌', duration: '約 60–75 分鐘', detail: '搭地鐵 1 號線至沙上站，再轉釜山金海輕軌前往機場。', tip: '19:30 出發，預留退稅、托運與安檢時間。', mapQuery: 'Nampo-dong Busan to Gimhae International Airport' },
  'airport-go-flight': { from: '金海機場', to: '22:00 班機', mode: '機場候機', duration: '約 2 小時 30 分鐘', detail: '抵達機場後完成報到、托運、退稅與安檢，留時間逛免稅店。', tip: '護照、登機證與伴手禮收在隨手可取的位置。', mapQuery: 'Gimhae International Airport' },
}

const getTabFromHash = () => {
    const hash = window.location.hash.replace('#', '')
    return hash === 'map' ? 'map' : hash.startsWith('day-') ? hash : 'day-1'
}

function App() {
  const [activeTab, setActiveTab] = useState(getTabFromHash)
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null)
  const [selectedTransit, setSelectedTransit] = useState<Transit | null>(null)

  useEffect(() => {
    window.history.replaceState(null, '', `#${activeTab}`)
  }, [activeTab])

  useEffect(() => {
    const onHashChange = () => setActiveTab(getTabFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedAttraction(null)
        setSelectedTransit(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const activeDay = useMemo(() => days.find((day) => `day-${day.day}` === activeTab) ?? days[0], [activeTab])

  const openMap = (query: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer')
  }

  const getTransit = (from: Stop, to: Stop): Transit => {
    const route = transitRoutes[`${from.id}-${to.id}`]
    return route ?? {
      from: from.title,
      to: to.title,
      mode: '步行／計程車',
      duration: '約 10–20 分鐘',
      detail: `從「${from.title}」前往「${to.title}」，建議依當下體力與地圖即時路況選擇步行或短程計程車。`,
      tip: '出發前可用 Google Maps 確認即時班次與營業時間。',
      mapQuery: `${from.title} Busan to ${to.title} Busan`,
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">✦</div>
        <div>
          <p className="eyebrow">BUSAN TRIP · 2026</p>
          <h1>釜山爽爽去</h1>
        </div>
        <div className="cloud-badge" aria-hidden="true">☁︎</div>
      </header>

      <main className="main-content">
        {activeTab === 'map' ? (
          <MapOverview />
        ) : (
          <>
            <section className="trip-intro">
              <div>
                <p className="eyebrow">5 DAYS · FREE TRAVEL</p>
                <h2>釜山自由行</h2>
                <p className="intro-copy">藍藍的海、軟綿綿的雲，<br />還有一起走遍釜山的每一站。</p>
              </div>
              <div className="sun-sticker" aria-hidden="true">
                <span>旅程</span>
                <strong>5 DAYS</strong>
              </div>
            </section>

            <nav className="day-tabs" aria-label="每日行程">
              {days.map((day) => (
                <button
                  className={activeTab === `day-${day.day}` ? 'day-tab active' : 'day-tab'}
                  key={day.day}
                  onClick={() => setActiveTab(`day-${day.day}`)}
                  type="button"
                >
                  <span>DAY</span>
                  <strong>{day.day}</strong>
                </button>
              ))}
            </nav>

            <section className="day-heading">
              <div>
                <p className="day-kicker">{activeDay.date} <span>／ 釜山</span></p>
                <h2>{activeDay.title}</h2>
                <p>{activeDay.subtitle}</p>
              </div>
              <div className="highlight-pill">✦ {activeDay.highlight}</div>
            </section>

            <section className="timeline" aria-label={`${activeDay.date} 行程時間軸`}>
              {activeDay.stops.map((stop, index) => {
                const nextStop = activeDay.stops[index + 1]
                return (
                  <div className="timeline-group" key={stop.id}>
                    <article className={stop.attraction ? 'timeline-item is-clickable' : 'timeline-item'}>
                      <div className="timeline-time">{stop.time}</div>
                      <div className="timeline-line">
                        <div className="timeline-dot">{stop.icon}</div>
                        {index < activeDay.stops.length - 1 && <div className="timeline-rail" />}
                      </div>
                      <div className="stop-card" onClick={() => stop.attraction && setSelectedAttraction(stop.attraction)}>
                        <div className="stop-card-top">
                          <span className="stop-label">{stop.label}</span>
                          {stop.attraction && <span className="open-hint">查看詳情 <span>↗</span></span>}
                        </div>
                        <h3>{stop.title}</h3>
                        <p>{stop.note}</p>
                      </div>
                    </article>
                    {nextStop && (
                      <button className="transit-button" type="button" onClick={() => setSelectedTransit(getTransit(stop, nextStop))}>
                        <span className="transit-icon">⌁</span>
                        <span>前往下一站</span>
                        <span className="transit-arrow">→</span>
                      </button>
                    )}
                  </div>
                )
              })}
            </section>
          </>
        )}
      </main>

      <footer className="bottom-nav" aria-label="主要導覽">
        <button className={activeTab === 'day-1' ? 'nav-item active' : 'nav-item'} type="button" onClick={() => setActiveTab('day-1')}>
          <span>☼</span>
          <small>行程</small>
        </button>
        <button className={activeTab === 'map' ? 'nav-item active' : 'nav-item'} type="button" onClick={() => setActiveTab('map')}>
          <span>⌖</span>
          <small>地圖總覽</small>
        </button>
      </footer>

      {selectedAttraction && <AttractionDialog attraction={selectedAttraction} onClose={() => setSelectedAttraction(null)} onOpenMap={openMap} />}
      {selectedTransit && <TransitDialog transit={selectedTransit} onClose={() => setSelectedTransit(null)} onOpenMap={openMap} />}
    </div>
  )
}

function MapOverview() {
  return (
    <section className="map-page">
      <div className="map-heading">
        <div>
          <p className="eyebrow">OUR LITTLE MAP</p>
          <h2>釜山地圖總覽</h2>
          <p>把每天的海、山、街道串成一條藍色路線。</p>
        </div>
        <span className="map-pin-large" aria-hidden="true">⌖</span>
      </div>
      <div className="map-frame-wrap">
        <iframe
          src="https://www.google.com/maps/d/embed?mid=1LViG0uqSl1tRwWVSPcHS9y29J1IUtqs&hl=zh-TW&ehbc=2E312F"
          title="釜山行程地圖"
          loading="lazy"
          allowFullScreen
        />
      </div>
      <div className="map-note">
        <span>☁</span>
        <p><strong>小提醒</strong><br />地圖可放大查看每天的景點位置，交通按鈕也會帶你前往 Google Maps。</p>
      </div>
    </section>
  )
}

function Dialog({ children, title, onClose, className = '' }: { children: React.ReactNode; title: string; onClose: () => void; className?: string }) {
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`dialog ${className}`} role="dialog" aria-modal="true" aria-label={title}>
        <button className="dialog-close" type="button" onClick={onClose} aria-label="關閉視窗">×</button>
        {children}
      </section>
    </div>
  )
}

function AttractionDialog({ attraction, onClose, onOpenMap }: { attraction: Attraction; onClose: () => void; onOpenMap: (query: string) => void }) {
  return (
    <Dialog title={attraction.title} onClose={onClose} className="attraction-dialog">
      <div className="dialog-eyebrow">{attraction.category}</div>
      <h2>{attraction.title}</h2>
      <Swiper
        className="photo-swiper"
        modules={[Pagination, Keyboard, A11y]}
        pagination={{ clickable: true }}
        keyboard
        spaceBetween={12}
        slidesPerView={1}
      >
        {attraction.images.map((src, index) => (
          <SwiperSlide key={src}>
            <img
              src={src}
              alt={`${attraction.title} 第 ${index + 1} 張照片`}
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = image('photo-1500534623283-312aade485b7')
              }}
            />
            <span className="photo-count">{index + 1} / {attraction.images.length}</span>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="dialog-copy">
        <p>{attraction.description}</p>
        <p className="dialog-detail">{attraction.details}</p>
      </div>
      <button className="map-link-button" type="button" onClick={() => onOpenMap(attraction.mapQuery)}>
        <span>⌖</span> 在 Google Maps 查看位置 <span>↗</span>
      </button>
    </Dialog>
  )
}

function TransitDialog({ transit, onClose, onOpenMap }: { transit: Transit; onClose: () => void; onOpenMap: (query: string) => void }) {
  return (
    <Dialog title={`${transit.from} 前往 ${transit.to}`} onClose={onClose} className="transit-dialog">
      <div className="dialog-eyebrow">NEXT STOP · 交通方式</div>
      <h2>{transit.from} <span className="dialog-arrow">→</span> {transit.to}</h2>
      <div className="route-summary">
        <div className="route-mode"><span>🚇</span><strong>{transit.mode}</strong></div>
        <span className="route-duration">{transit.duration}</span>
      </div>
      <div className="route-block">
        <span className="route-block-icon">☼</span>
        <div>
          <strong>建議交通方式</strong>
          <p>{transit.detail}</p>
        </div>
      </div>
      <div className="tip-block">
        <span>✦</span>
        <p>{transit.tip}</p>
      </div>
      <button className="map-link-button" type="button" onClick={() => onOpenMap(transit.mapQuery)}>
        <span>⌖</span> 於 Google Maps 打開 <span>↗</span>
      </button>
    </Dialog>
  )
}

export default App
