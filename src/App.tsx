/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {useMemo, useState} from 'react';
import {
  Award,
  Battery,
  Bell,
  Bus,
  Calendar as CalendarIcon,
  CalendarDays,
  Car,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  ExternalLink,
  Film,
  Footprints,
  GraduationCap,
  Info,
  LogIn,
  MapPin,
  Mic,
  Music,
  Navigation,
  QrCode,
  Share2,
  ShieldCheck,
  Signal,
  Sparkle,
  Sparkles,
  Ticket,
  User,
  Users,
  Utensils,
  Wifi,
  X,
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';

type UserMode = 'student' | 'external';
type TabId = 'events' | 'calendar' | 'map' | 'profile';
type CategoryId = 'all' | 'cinema' | 'food' | 'urban' | 'workshops';
type PoiId = 'screen' | 'pedestrian' | 'food' | 'restroom' | 'bus';

interface CategoryMeta {
  id: CategoryId;
  label: string;
  shortLabel?: string;
  chipActive: string;
  dot?: string;
  gradient?: string;
  icon?: LucideIcon;
}

interface CulturalEvent {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  time: string;
  location: string;
  category: Exclude<CategoryId, 'all'>;
  tagLabel: string;
  extensionBadge: string | null;
  extensionHours: number;
  ageRating: string;
  highlight: string | null;
  customIcon?: LucideIcon;
  customGradient?: string;
  partners: string[];
  synopsis: string;
}

interface PoiMeta {
  id: PoiId;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  color: string;
}

const CATEGORY_CONFIG: Record<CategoryId, CategoryMeta> = {
  all: {
    id: 'all',
    label: 'Todos',
    chipActive: 'bg-[#003366] text-white border-[#003366]',
  },
  cinema: {
    id: 'cinema',
    label: 'Cinema & Debate (BocaCine)',
    shortLabel: 'Cinema & Debate',
    chipActive: 'bg-cyan-600 text-white border-cyan-600',
    dot: 'bg-cyan-500',
    gradient: 'from-[#003366] via-[#0055A5] to-cyan-500',
    icon: Film,
  },
  food: {
    id: 'food',
    label: 'Feiras & Gastronomia',
    shortLabel: 'Feiras & Gastronomia',
    chipActive: 'bg-amber-600 text-white border-amber-600',
    dot: 'bg-amber-500',
    gradient: 'from-amber-600 via-orange-500 to-rose-500',
    icon: Utensils,
  },
  urban: {
    id: 'urban',
    label: 'Cena Urbana & Ballroom',
    shortLabel: 'Cena Urbana',
    chipActive: 'bg-purple-600 text-white border-purple-600',
    dot: 'bg-purple-500',
    gradient: 'from-purple-700 via-fuchsia-600 to-pink-500',
    icon: Sparkles,
  },
  workshops: {
    id: 'workshops',
    label: 'Oficinas & Dança',
    shortLabel: 'Oficinas',
    chipActive: 'bg-emerald-600 text-white border-emerald-600',
    dot: 'bg-emerald-500',
    gradient: 'from-emerald-600 via-teal-500 to-cyan-600',
    icon: Music,
  },
};

const EVENTS_DATA: CulturalEvent[] = [
  {
    id: 'evt-autocine-compadecida',
    date: '2026-11-20',
    title: 'Cine UFMS: "O Auto da Compadecida"',
    subtitle: 'Parceria BocaCine',
    time: '19:00 - 21:00',
    location: 'Telão Principal - Autocine UFMS',
    category: 'cinema',
    tagLabel: 'Cinema & Debate',
    extensionBadge: '+2h Extensão PROECE',
    extensionHours: 2,
    ageRating: '12 anos',
    highlight: null,
    partners: ['BocaCine', 'PROECE UFMS', 'Cobertura Mafe Cabral'],
    synopsis:
      'Sessão especial ao ar livre no telão gigante do Autocine UFMS exibindo o clássico do cinema nacional. Após o filme, haverá debate aberto mediado pelo coletivo BocaCine sobre cinema brasileiro, estética regional e produção universitária.',
  },
  {
    id: 'evt-feira-bosque-borogodo',
    date: '2026-11-20',
    title: 'Feira Cultural & Gastronomia',
    subtitle: 'Bosque da Paz & Borogodó',
    time: '18:00 - 22:00',
    location: 'Praça de Alimentação Autocine',
    category: 'food',
    tagLabel: 'Feiras & Gastronomia',
    extensionBadge: null,
    extensionHours: 0,
    ageRating: 'Livre',
    highlight: 'Food trucks e artesanato local',
    partners: ['Bosque da Paz', 'Feira Borogodó', 'Economia Criativa CG'],
    synopsis:
      'Circuito gastronômico e feira de economia criativa integrando o Autocine para resolver a demanda de alimentação no campus à noite. Conte com food trucks, comidas típicas de MS, opções vegetarianas, bebidas artesanais e expositores locais.',
  },
  {
    id: 'evt-vogue-ms',
    date: '2026-11-20',
    title: 'Cena Ballroom: "Festival Vogue MS"',
    subtitle: 'Coletivo Transpor',
    time: '21:30 - 23:30',
    location: 'Palco Arena Autocine',
    category: 'urban',
    tagLabel: 'Cena Urbana & Diversidade',
    extensionBadge: '+2h Extensão',
    extensionHours: 2,
    ageRating: '14 anos',
    highlight: null,
    partners: ['Coletivo Transpor', 'Casa Pantanal Ballroom', 'Cobertura Mafe Cabral'],
    synopsis:
      'Grande celebração da cultura Ballroom sul-mato-grossense com categorias de Runway, Vogue Femme, Face e Best Dressed. Evento de ocupação cultural, acolhimento LGBTQIAPN+ e valorização das performances urbanas dentro da universidade pública.',
  },
  {
    id: 'evt-duelo-campus',
    date: '2026-11-20',
    title: 'Batalha de Rima: "Duelo no Campus"',
    subtitle: 'Edição Noturna Integrada',
    time: '22:45 - 01:00',
    location: 'Arena Central',
    category: 'urban',
    tagLabel: 'Hip-Hop & Cultura',
    extensionBadge: null,
    extensionHours: 0,
    ageRating: '16 anos',
    highlight: 'Cypher aberta & DJ set',
    customIcon: Mic,
    customGradient: 'from-indigo-700 via-purple-700 to-violet-600',
    partners: ['Coletivo Hip-Hop CG', 'Batalha do Lago', 'Atléticas UFMS'],
    synopsis:
      'Confronto de MCs de Campo Grande em formato eliminatório com beats ao vivo, pocket shows e cypher aberta ao público. Integração direta entre a cena periférica da capital e os estudantes da Cidade Universitária.',
  },
  {
    id: 'evt-oficina-ginga',
    date: '2026-11-20',
    title: 'Oficina Aberta de Dança & Projeto Ginga',
    subtitle: 'Vivência Corporal ao Pôr do Sol',
    time: '17:30 - 19:00',
    location: 'Espaço Convivência',
    category: 'workshops',
    tagLabel: 'Oficinas',
    extensionBadge: '+1h30 Extensão',
    extensionHours: 1.5,
    ageRating: 'Livre',
    highlight: 'Aberta a iniciantes',
    partners: ['Projeto Ginga UFMS', 'Curso de Educação Física', 'PROECE'],
    synopsis:
      'Aulão aberto misturando danças urbanas, ritmos afro-brasileiros e movimentação de capoeira contemporânea. Aberta para estudantes e moradores de Campo Grande sem necessidade de experiência prévia.',
  },
  {
    id: 'evt-curtas-pantanal',
    date: '2026-11-16',
    title: 'Cineclube Acadêmico: Curtas do Pantanal',
    subtitle: 'Mostra Estudantil Audiovisual',
    time: '19:00 - 20:45',
    location: 'Telão Principal - Autocine UFMS',
    category: 'cinema',
    tagLabel: 'Cinema & Debate',
    extensionBadge: '+1h30 Extensão PROECE',
    extensionHours: 1.5,
    ageRating: 'Livre',
    highlight: null,
    partners: ['Jornalismo & Audiovisual UFMS', 'BocaCine'],
    synopsis:
      'Seleção de curtas-metragens produzidos por acadêmicos e realizadores independentes de MS retratando memória, meio ambiente e identidades pantaneiras.',
  },
  {
    id: 'evt-sarau-livros',
    date: '2026-11-18',
    title: 'Sarau Poético & Feira de Vinil',
    subtitle: 'Edição Pôr do Sol no Lago',
    time: '18:00 - 21:00',
    location: 'Espaço Convivência',
    category: 'food',
    tagLabel: 'Feiras & Gastronomia',
    extensionBadge: '+1h Extensão',
    extensionHours: 1,
    ageRating: 'Livre',
    highlight: 'Troca de livros e cafés especiais',
    partners: ['Editora UFMS', 'Sebo & Vinil CG'],
    synopsis:
      'Microfone aberto para poesia falada e música acústica acompanhado por feira de livros independentes, discos de vinil e cafés regionais.',
  },
  {
    id: 'evt-mostra-indigena',
    date: '2026-11-19',
    title: 'Mostra Audiovisual Indígena MS',
    subtitle: 'Territórios e Narrativas',
    time: '19:30 - 21:30',
    location: 'Telão Principal - Autocine UFMS',
    category: 'cinema',
    tagLabel: 'Cinema & Debate',
    extensionBadge: '+2h Extensão PROECE',
    extensionHours: 2,
    ageRating: '10 anos',
    highlight: null,
    partners: ['Coletivo Indígena UFMS', 'BocaCine', 'PROECE'],
    synopsis:
      'Exibição comentada de produções audiovisuais de cineastas Terena, Guarani e Kaiowá, seguida de roda de conversa no gramado do Autocine.',
  },
  {
    id: 'evt-sabado-familia',
    date: '2026-11-21',
    title: 'Autocine em Família: "O Menino e o Mundo"',
    subtitle: 'Sessão Drive-in & Piquenique',
    time: '18:30 - 20:30',
    location: 'Telão Principal - Autocine UFMS',
    category: 'cinema',
    tagLabel: 'Cinema & Debate',
    extensionBadge: null,
    extensionHours: 0,
    ageRating: 'Livre',
    highlight: 'Entrada livre de carros e pedestres',
    partners: ['UFMS Cultura', 'Bosque da Paz'],
    synopsis:
      'Programação especial de sábado voltada à comunidade externa de Campo Grande, crianças e famílias. Traga sua canga ou assista do carro sintonizando o rádio FM.',
  },
  {
    id: 'evt-feira-sabado',
    date: '2026-11-21',
    title: 'Piquenique Cultural & Food Trucks',
    subtitle: 'Sabores de Campo Grande',
    time: '17:30 - 22:00',
    location: 'Praça de Alimentação Autocine',
    category: 'food',
    tagLabel: 'Feiras & Gastronomia',
    extensionBadge: null,
    extensionHours: 0,
    ageRating: 'Livre',
    highlight: 'Espaço kids e música ambiente',
    partners: ['Feira Borogodó', 'Bosque da Paz'],
    synopsis:
      'Tarde e noite de gastronomia acessível, sobremesas artesanais e feira criativa integrando visitantes do bairro Universitário e toda a cidade.',
  },
  {
    id: 'evt-bateria-samba',
    date: '2026-11-22',
    title: 'Ensaio Aberto: Percussão & Samba no Campus',
    subtitle: 'Roda Cultural de Domingo',
    time: '17:00 - 19:30',
    location: 'Palco Arena Autocine',
    category: 'workshops',
    tagLabel: 'Oficinas',
    extensionBadge: '+1h30 Extensão',
    extensionHours: 1.5,
    ageRating: 'Livre',
    highlight: 'Oficina de percussão às 17h',
    partners: ['Bateria Universitária UFMS', 'Projeto Ginga'],
    synopsis:
      'Oficina prática de introdução aos instrumentos de percussão brasileira seguida de roda de samba aberta no pôr do sol.',
  },
];

const QUICK_DAYS = [
  {date: '2026-11-16', weekday: 'Seg', day: '16'},
  {date: '2026-11-17', weekday: 'Ter', day: '17'},
  {date: '2026-11-18', weekday: 'Qua', day: '18'},
  {date: '2026-11-19', weekday: 'Qui', day: '19'},
  {date: '2026-11-20', weekday: 'Sex', day: '20', badge: 'Festival'},
  {date: '2026-11-21', weekday: 'Sáb', day: '21'},
  {date: '2026-11-22', weekday: 'Dom', day: '22'},
];

const VALIDATED_CERTIFICATES = [
  {
    id: 'cert-1',
    title: 'Mostra BocaCine: Cinema Sul-Mato-Grossense',
    date: '18 Out 2026',
    hours: 2,
    code: 'PROECE-2026-8841',
  },
  {
    id: 'cert-2',
    title: 'Oficina de Danças Urbanas & Ginga',
    date: '25 Out 2026',
    hours: 2,
    code: 'PROECE-2026-9012',
  },
  {
    id: 'cert-3',
    title: 'Cine-Debate: Juventudes e Periferia',
    date: '06 Nov 2026',
    hours: 2,
    code: 'PROECE-2026-9450',
  },
];

const MAP_POIS: Record<PoiId, PoiMeta> = {
  screen: {
    id: 'screen',
    title: 'Telão Drive-in & Projeção 4K',
    subtitle: 'Área Principal • Sintonia FM 87,9',
    description:
      'Vagas demarcadas para até 120 veículos com áudio via rádio FM e sistema de som externo direcionado para a arquibancada.',
    tag: 'Cinema & Debates',
    color: 'bg-[#003366]',
  },
  pedestrian: {
    id: 'pedestrian',
    title: 'Área de Pedestres, Cadeiras & Palco Arena',
    subtitle: 'Capacidade para 600 pessoas • Acessível',
    description:
      'Espaço gramado e piso nivelado com cadeiras disponíveis, cangas liberadas e vista frontal para o telão e o Palco Arena (Vogue MS & Batalhas).',
    tag: 'Sem carro / Pedestre',
    color: 'bg-purple-600',
  },
  food: {
    id: 'food',
    title: 'Praça de Food Trucks & Feira Borogodó',
    subtitle: 'Alimentação & Artesanato • 18h às 23h',
    description:
      '12 estações gastronômicas com lanches, pastéis, comidas regionais, opções veganas e bebidas. Aceita Pix e cartões.',
    tag: 'Gastronomia',
    color: 'bg-amber-600',
  },
  restroom: {
    id: 'restroom',
    title: 'Sanitários & Bebedouros Acessíveis',
    subtitle: 'Módulos iluminados com acessibilidade PCD',
    description:
      'Conjunto de banheiros femininos, masculinos e cabines adaptadas com manutenção contínua durante todo o evento.',
    tag: 'Infraestrutura',
    color: 'bg-emerald-600',
  },
  bus: {
    id: 'bus',
    title: 'Ponto de Embarque Capi Shuttle & Apps',
    subtitle: 'Entrada Portão Costa e Silva • Baia Segura',
    description:
      'Parada oficial do ônibus circular interno (Capi Shuttle) e zona iluminada para embarque/desembarque de Uber, 99 e táxis.',
    tag: 'Mobilidade',
    color: 'bg-cyan-600',
  },
};

export default function App() {
  const [userMode, setUserMode] = useState<UserMode>('student');
  const [activeTab, setActiveTab] = useState<TabId>('events');
  const [selectedDay, setSelectedDay] = useState<string>('2026-11-20');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [confirmedIds, setConfirmedIds] = useState<string[]>([
    'evt-autocine-compadecida',
  ]);
  const [modalEvent, setModalEvent] = useState<CulturalEvent | null>(null);
  const [selectedCalendarDay, setSelectedCalendarDay] =
    useState<string>('2026-11-20');
  const [selectedPoi, setSelectedPoi] = useState<PoiId>('pedestrian');
  const [weeklyAlerts, setWeeklyAlerts] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showRouteSheet, setShowRouteSheet] = useState<boolean>(false);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  const toggleUserMode = () => {
    const next: UserMode = userMode === 'student' ? 'external' : 'student';
    setUserMode(next);
    showToast(
      next === 'student'
        ? 'Modo Estudante (Sou UFMS) ativado'
        : 'Modo Comunidade Externa (Acesso Aberto) ativado'
    );
  };

  const toggleConfirmEvent = (eventId: string) => {
    setConfirmedIds((prev) => {
      const exists = prev.includes(eventId);
      const updated = exists
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId];
      showToast(
        exists
          ? 'Evento removido da sua agenda'
          : 'Presença confirmada! Salvo na sua agenda.'
      );
      return updated;
    });
  };

  const handleShareEvent = async (evt: CulturalEvent) => {
    const shareText = `${evt.title} (${evt.time}) — ${evt.location} | UFMS Cultura / Autocine UFMS`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
      }
    } catch {
      // Fallback silencioso para contextos sem permissão de clipboard
    }
    showToast(`Convite de "${evt.title}" copiado!`);
  };

  const eventsByDate = useMemo(() => {
    const map: Record<string, CulturalEvent[]> = {};
    EVENTS_DATA.forEach((evt) => {
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    });
    return map;
  }, []);

  const filteredEvents = useMemo(() => {
    return EVENTS_DATA.filter((evt) => {
      const matchDay = evt.date === selectedDay;
      const matchCat =
        selectedCategory === 'all' || evt.category === selectedCategory;
      return matchDay && matchCat;
    });
  }, [selectedDay, selectedCategory]);

  const savedEventsList = useMemo(
    () => EVENTS_DATA.filter((evt) => confirmedIds.includes(evt.id)),
    [confirmedIds]
  );

  const renderEventCard = (evt: CulturalEvent) => {
    const catMeta = CATEGORY_CONFIG[evt.category];
    const IconComp = evt.customIcon || catMeta.icon || Film;
    const bannerGradient = evt.customGradient || catMeta.gradient || 'from-[#003366] to-[#0055A5]';
    const isConfirmed = confirmedIds.includes(evt.id);

    return (
      <button
        type="button"
        key={evt.id}
        onClick={() => setModalEvent(evt)}
        className="w-full text-left group bg-white rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden active:scale-[0.985] transition-all duration-150 cursor-pointer hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055A5]"
      >
        {/* Banner ilustrativo em CSS (zero imagens quebradas) */}
        <div
          className={`relative h-24 bg-gradient-to-r ${bannerGradient} p-3.5 flex flex-col justify-between overflow-hidden`}
        >
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 blur-[1px]" />
          <div className="absolute right-8 -bottom-8 w-20 h-20 rounded-full bg-white/10" />
          <IconComp className="absolute right-3.5 bottom-3 w-12 h-12 text-white/20 stroke-[1.5]" />

          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-md text-white border border-white/25 whitespace-nowrap">
              <IconComp className="w-3 h-3 shrink-0" />
              {evt.tagLabel}
            </span>

            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/30 backdrop-blur-sm text-white whitespace-nowrap tabular-nums">
              {evt.ageRating}
            </span>
          </div>

          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-white/95 tracking-wide truncate">
              {evt.subtitle}
            </span>

            {isConfirmed && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-emerald-950 shadow-sm shrink-0 whitespace-nowrap">
                <Check className="w-3 h-3 stroke-[2.5]" />
                Confirmado
              </span>
            )}
          </div>
        </div>

        {/* Corpo do Card */}
        <div className="p-3.5 space-y-2.5">
          <h3 className="text-[15px] font-bold text-[#003366] leading-snug group-hover:text-[#0055A5] transition-colors">
            {evt.title}
          </h3>

          <div className="flex flex-col gap-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#0055A5] shrink-0" />
              <span className="font-semibold text-slate-700 tabular-nums">
                {evt.time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#0055A5] shrink-0" />
              <span className="truncate">{evt.location}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5">
              {evt.extensionBadge && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                    userMode === 'student'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <Award className="w-3 h-3 shrink-0" />
                  {evt.extensionBadge}
                </span>
              )}

              {evt.highlight && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
                  <Sparkle className="w-3 h-3 shrink-0" />
                  {evt.highlight}
                </span>
              )}
            </div>

            <span className="text-[11px] font-semibold text-[#0055A5] ml-auto whitespace-nowrap">
              Ver detalhes →
            </span>
          </div>
        </div>
      </button>
    );
  };

  const renderEventsTab = () => {
    const selectedDayMeta = QUICK_DAYS.find((d) => d.date === selectedDay);

    return (
      <div className="space-y-4 pb-6">
        {/* Banner contextual ao modo */}
        <div className="px-4 pt-3">
          {userMode === 'external' ? (
            <div className="bg-gradient-to-r from-[#003366]/10 to-cyan-500/10 border border-[#0055A5]/20 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#003366] text-white flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#003366]">
                  Comunidade Externa • Entrada Gratuita
                </p>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                  Eventos abertos a toda Campo Grande, sem necessidade de login ou RGA.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#003366] truncate tabular-nums">
                    Olá, Luiza! • 6h/20h Extensão
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    Eventos com selo validam horas na PROECE via QR Code.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-[#003366]/5 hover:bg-[#003366]/10 text-[#003366] transition-colors shrink-0 cursor-pointer"
                title="Simular Check-in QR Code"
                aria-label="Abrir QR Code de Check-in PROECE"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Seletor Rápido de Dias */}
        <div>
          <div className="px-4 flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Novembro 2026
            </h2>
            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className="text-xs font-semibold text-[#0055A5] hover:underline cursor-pointer"
            >
              Ver mês completo
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 pt-2 pb-1 no-scrollbar">
            {QUICK_DAYS.map((item) => {
              const dayEvents = eventsByDate[item.date] || [];
              const isSelected = selectedDay === item.date;

              return (
                <button
                  type="button"
                  key={item.date}
                  onClick={() => setSelectedDay(item.date)}
                  className={`relative shrink-0 w-[52px] py-2.5 rounded-2xl flex flex-col items-center justify-center transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#003366] text-white border-[#003366] shadow-md shadow-[#003366]/20'
                      : 'bg-white text-slate-700 border-slate-200/80 hover:border-[#0055A5]/40'
                  }`}
                >
                  {item.badge && (
                    <span
                      className={`absolute -top-2 px-1.5 py-[1px] rounded-full text-[8px] font-extrabold uppercase tracking-wide ${
                        isSelected
                          ? 'bg-amber-400 text-amber-950'
                          : 'bg-purple-600 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-medium ${
                      isSelected ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {item.weekday}
                  </span>
                  <span className="text-base font-bold leading-tight mt-0.5 tabular-nums">
                    {item.day}
                  </span>

                  <div className="flex items-center gap-0.5 mt-1 h-1.5">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <span
                        key={ev.id}
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected
                            ? 'bg-cyan-300'
                            : CATEGORY_CONFIG[ev.category].dot
                        }`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtros por Categoria */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
          {Object.values(CATEGORY_CONFIG).map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? `${cat.chipActive} shadow-sm`
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Feed de Programação */}
        <div className="px-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#003366]">
              Programação · {selectedDayMeta?.weekday}, {selectedDayMeta?.day} Nov
            </h2>
            <span className="text-xs font-medium text-slate-500 tabular-nums">
              {filteredEvents.length}{' '}
              {filteredEvents.length === 1 ? 'atração' : 'atrações'}
            </span>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="space-y-3.5">
              {filteredEvents.map((evt) => renderEventCard(evt))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-200/70 shadow-sm">
              <CalendarDays className="w-9 h-9 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">
                Nenhuma atração nesta categoria neste dia
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Experimente limpar o filtro ou conferir a programação especial de Sexta, 20 Nov.
              </p>
              <div className="flex justify-center gap-2 mt-3">
                {selectedCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    Ver todas categorias
                  </button>
                )}
                {selectedDay !== '2026-11-20' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDay('2026-11-20');
                      setSelectedCategory('all');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#003366] text-xs font-semibold text-white cursor-pointer"
                  >
                    Ir para Sexta, 20 Nov
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCalendarTab = () => {
    const daysInNov = Array.from({length: 30}, (_, i) => {
      const dayNum = i + 1;
      const dateStr = `2026-11-${String(dayNum).padStart(2, '0')}`;
      return {dayNum, dateStr, events: eventsByDate[dateStr] || []};
    });

    const selectedDateEvents = eventsByDate[selectedCalendarDay] || [];
    const formattedSelectedDay = Number(selectedCalendarDay.split('-')[2]);

    return (
      <div className="p-4 space-y-4 pb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/70">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-[#003366]">
                Novembro 2026
              </h2>
              <p className="text-[11px] text-slate-500">
                Toque nos dias destacados para ver a programação
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  showToast('Exibindo calendário oficial de Novembro 2026')
                }
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  showToast('Agenda de Dezembro em breve na PROECE')
                }
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
                aria-label="Próximo mês"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400 mb-2">
            <span>D</span>
            <span>S</span>
            <span>T</span>
            <span>Q</span>
            <span>Q</span>
            <span>S</span>
            <span>S</span>
          </div>

          <div className="grid grid-cols-7 gap-y-1.5 gap-x-1">
            {daysInNov.map(({dayNum, dateStr, events}) => {
              const hasEvents = events.length > 0;
              const isSelected = selectedCalendarDay === dateStr;
              const isToday = dateStr === '2026-11-16';

              return (
                <button
                  type="button"
                  key={dateStr}
                  onClick={() => setSelectedCalendarDay(dateStr)}
                  className={`relative h-11 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer tabular-nums ${
                    isSelected
                      ? 'bg-[#003366] text-white shadow-md shadow-[#003366]/25 font-bold'
                      : hasEvents
                        ? 'bg-[#F0F4F8] text-[#003366] font-bold hover:bg-blue-100/70'
                        : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {isToday && !isSelected && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#0055A5]" />
                  )}
                  <span className="text-xs">{dayNum}</span>

                  <div className="flex items-center gap-0.5 mt-0.5 h-1.5">
                    {events.slice(0, 3).map((ev) => (
                      <span
                        key={ev.id}
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected
                            ? 'bg-cyan-300'
                            : CATEGORY_CONFIG[ev.category].dot
                        }`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] font-medium text-slate-600">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-500" /> Cinema
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Feiras
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> Cena Urbana
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Oficinas
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#003366]">
              Agenda · {formattedSelectedDay} de Novembro
            </h3>
            <span className="text-xs font-semibold text-slate-500 tabular-nums">
              {selectedDateEvents.length}{' '}
              {selectedDateEvents.length === 1 ? 'evento' : 'eventos'}
            </span>
          </div>

          {selectedDateEvents.length > 0 ? (
            <div className="space-y-2.5">
              {selectedDateEvents.map((evt) => {
                const cat = CATEGORY_CONFIG[evt.category];
                const IconComp = evt.customIcon || cat.icon || Film;
                const isConfirmed = confirmedIds.includes(evt.id);

                return (
                  <button
                    type="button"
                    key={evt.id}
                    onClick={() => setModalEvent(evt)}
                    className="w-full text-left bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200/70 flex items-center gap-3 cursor-pointer hover:border-[#0055A5]/40 transition-all active:scale-[0.99]"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${
                        evt.customGradient || cat.gradient
                      } text-white flex items-center justify-center shrink-0`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[#0055A5] tabular-nums">
                          {evt.time}
                        </span>
                        {isConfirmed && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-[#003366] truncate mt-0.5">
                        {evt.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {evt.location}
                      </p>
                    </div>
                    {evt.extensionBadge && (
                      <span className="shrink-0 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold tabular-nums">
                        +{evt.extensionHours}h
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-5 text-center border border-slate-200/70 shadow-sm">
              <p className="text-xs font-semibold text-slate-600">
                Sem programação cadastrada para {formattedSelectedDay} de Novembro.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCalendarDay('2026-11-20')}
                className="mt-2.5 px-3.5 py-2 rounded-xl bg-[#003366] text-white text-xs font-semibold cursor-pointer"
              >
                Ver Festival de 20 Nov
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMapTab = () => {
    const activePoiData = MAP_POIS[selectedPoi];

    return (
      <div className="p-4 space-y-4 pb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/70 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-extrabold text-[#003366]">
                Mapa do Espaço · Autocine UFMS
              </h2>
              <p className="text-[11px] text-slate-500">
                Cidade Universitária · Toque nos pontos para detalhes
              </p>
            </div>
            <span className="px-2 py-1 rounded-lg bg-blue-50 text-[#0055A5] text-[10px] font-bold whitespace-nowrap">
              Interativo
            </span>
          </div>

          {/* Planta Esquemática Estilizada */}
          <div className="relative h-60 rounded-2xl bg-gradient-to-b from-slate-800 via-[#0d2744] to-emerald-950/90 border border-slate-200 overflow-hidden p-3 select-none">
            <div className="absolute inset-x-0 bottom-0 h-10 bg-slate-700/80 border-t border-dashed border-amber-300/50 flex items-center justify-between px-4">
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">
                Av. Costa e Silva · Portão UFMS
              </span>
              <span className="text-[9px] text-cyan-300 font-semibold">
                Entrada Principal ↑
              </span>
            </div>

            <div className="absolute -left-6 top-8 w-20 h-32 rounded-full bg-emerald-500/20 border border-emerald-400/20" />
            <div className="absolute right-2 top-3 px-2 py-0.5 rounded bg-white/10 text-[9px] text-white/75 font-medium">
              Cidade Universitária
            </div>

            {/* Telão Drive-in */}
            <button
              type="button"
              onClick={() => setSelectedPoi('screen')}
              className={`absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center transition-transform cursor-pointer ${
                selectedPoi === 'screen'
                  ? 'scale-110 z-20'
                  : 'opacity-90 hover:scale-105'
              }`}
            >
              <div
                className={`px-3 py-1.5 rounded-xl border-2 text-white text-[10px] font-bold flex items-center gap-1.5 shadow-lg whitespace-nowrap ${
                  selectedPoi === 'screen'
                    ? 'bg-[#0055A5] border-cyan-300'
                    : 'bg-[#003366] border-white/40'
                }`}
              >
                <Film className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                Telão Drive-in
              </div>
              <div className="w-24 h-1 bg-cyan-400/60 rounded-full mt-1" />
            </button>

            {/* Área de Pedestres / Cadeiras */}
            <button
              type="button"
              onClick={() => setSelectedPoi('pedestrian')}
              className={`absolute top-[74px] left-1/2 -translate-x-1/2 transition-transform cursor-pointer ${
                selectedPoi === 'pedestrian'
                  ? 'scale-105 z-20'
                  : 'opacity-90 hover:scale-105'
              }`}
            >
              <div
                className={`px-3 py-2 rounded-xl border-2 text-white text-[10px] font-bold flex items-center gap-1.5 shadow-lg whitespace-nowrap ${
                  selectedPoi === 'pedestrian'
                    ? 'bg-purple-600 border-purple-200'
                    : 'bg-purple-700/90 border-white/30'
                }`}
              >
                <Footprints className="w-3.5 h-3.5 text-purple-200 shrink-0" />
                Pedestres, Cadeiras & Palco
              </div>
            </button>

            <div className="absolute top-[76px] left-3 flex flex-col gap-1 opacity-55 pointer-events-none">
              <Car className="w-3.5 h-3.5 text-slate-300" />
              <Car className="w-3.5 h-3.5 text-slate-300" />
            </div>

            {/* Praça de Food Trucks */}
            <button
              type="button"
              onClick={() => setSelectedPoi('food')}
              className={`absolute top-[128px] right-3 transition-transform cursor-pointer ${
                selectedPoi === 'food'
                  ? 'scale-105 z-20'
                  : 'opacity-90 hover:scale-105'
              }`}
            >
              <div
                className={`px-2.5 py-1.5 rounded-xl border-2 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg whitespace-nowrap ${
                  selectedPoi === 'food'
                    ? 'bg-amber-600 border-amber-200'
                    : 'bg-amber-700/90 border-white/30'
                }`}
              >
                <Utensils className="w-3 h-3 shrink-0" />
                Food Trucks
              </div>
            </button>

            {/* Banheiros */}
            <button
              type="button"
              onClick={() => setSelectedPoi('restroom')}
              className={`absolute top-[130px] left-3 transition-transform cursor-pointer ${
                selectedPoi === 'restroom'
                  ? 'scale-105 z-20'
                  : 'opacity-90 hover:scale-105'
              }`}
            >
              <div
                className={`px-2.5 py-1.5 rounded-xl border-2 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg whitespace-nowrap ${
                  selectedPoi === 'restroom'
                    ? 'bg-emerald-600 border-emerald-200'
                    : 'bg-emerald-700/90 border-white/30'
                }`}
              >
                <Info className="w-3 h-3 shrink-0" />
                Banheiros
              </div>
            </button>

            {/* Ponto de Embarque */}
            <button
              type="button"
              onClick={() => setSelectedPoi('bus')}
              className={`absolute bottom-11 left-1/2 -translate-x-1/2 transition-transform cursor-pointer ${
                selectedPoi === 'bus'
                  ? 'scale-105 z-20'
                  : 'opacity-90 hover:scale-105'
              }`}
            >
              <div
                className={`px-3 py-1.5 rounded-xl border-2 text-white text-[10px] font-bold flex items-center gap-1.5 shadow-lg whitespace-nowrap ${
                  selectedPoi === 'bus'
                    ? 'bg-cyan-600 border-cyan-200'
                    : 'bg-cyan-700/90 border-white/30'
                }`}
              >
                <Bus className="w-3.5 h-3.5 shrink-0" />
                Ponto de Embarque / Shuttle
              </div>
            </button>
          </div>

          {/* Detalhe do POI Selecionado */}
          <div className="bg-[#F0F4F8] rounded-xl p-3 border border-slate-200/80">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-[#003366]">
                {activePoiData.title}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white whitespace-nowrap ${activePoiData.color}`}
              >
                {activePoiData.tag}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-[#0055A5] mb-1">
              {activePoiData.subtitle}
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {activePoiData.description}
            </p>
          </div>
        </div>

        {/* Card de Mobilidade & Transporte */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/70 space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#003366] text-white flex items-center justify-center shrink-0">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#003366]">
                Mobilidade & Transporte (Sem Carro)
              </h3>
              <p className="text-[11px] text-slate-500">
                Acesso facilitado para estudantes e comunidade externa
              </p>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#003366] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#0055A5] shrink-0" />
                Ônibus Interno UFMS (Capi Shuttle)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold whitespace-nowrap">
                Gratuito
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Rota estendida em dias de Autocine:{' '}
              <strong>
                Reitoria → Biblioteca → Restaurante Universitário → Autocine UFMS
              </strong>
              .
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['17:15', '18:00', '18:45', '21:15', '23:15', '00:30'].map(
                (hr) => (
                  <span
                    key={hr}
                    className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-[10px] font-bold text-[#003366] tabular-nums"
                  >
                    {hr}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              Ônibus Municipais · Terminal Morenão
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Saindo do <strong>Terminal Morenão</strong>, utilize as linhas
              abaixo com parada em frente ao Portão Principal da Av. Costa e Silva
              (a 180m do Autocine):
            </p>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <div className="bg-white rounded-lg p-1.5 border border-slate-200 text-center">
                <p className="text-[11px] font-extrabold text-[#003366] tabular-nums">
                  Linha 070
                </p>
                <p className="text-[9px] text-slate-500">Morenão / B. Bandeira</p>
              </div>
              <div className="bg-white rounded-lg p-1.5 border border-slate-200 text-center">
                <p className="text-[11px] font-extrabold text-[#003366] tabular-nums">
                  Linha 072
                </p>
                <p className="text-[9px] text-slate-500">Morenão / Nova Bahia</p>
              </div>
              <div className="bg-white rounded-lg p-1.5 border border-slate-200 text-center">
                <p className="text-[11px] font-extrabold text-[#003366] tabular-nums">
                  Linha 087
                </p>
                <p className="text-[9px] text-slate-500">Guaicurus / UFMS</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowRouteSheet(true)}
            className="w-full py-3 px-4 rounded-xl bg-[#003366] hover:bg-[#0055A5] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Navigation className="w-4 h-4 shrink-0" />
            Abrir rota no Google Maps / Uber
            <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
          </button>
        </div>
      </div>
    );
  };

  const renderProfileTab = () => {
    const potentialHours = savedEventsList.reduce(
      (acc, ev) => acc + (ev.extensionHours || 0),
      0
    );

    if (userMode === 'external') {
      return (
        <div className="p-4 space-y-4 pb-6">
          <div className="bg-gradient-to-br from-[#003366] to-[#0055A5] rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-cyan-200" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 text-[10px] font-bold uppercase tracking-wide">
                  Acesso Aberto
                </span>
                <h2 className="text-base font-extrabold mt-0.5">
                  Comunidade Externa
                </h2>
                <p className="text-xs text-blue-100">
                  Campo Grande / MS · Sem vínculo acadêmico
                </p>
              </div>
            </div>

            <p className="relative z-10 text-xs text-blue-100/95 mt-3 leading-relaxed">
              Todos os filmes, feiras gastronômicas, batalhas e oficinas do
              Autocine UFMS são gratuitos e abertos para você e sua família.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/70 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#003366]">
                  Agenda Semanal do Autocine
                </h3>
                <p className="text-[11px] text-slate-500">
                  Receba alertas toda quarta-feira com a programação do fim de semana.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={weeklyAlerts}
              aria-label="Ativar notificações da agenda semanal"
              onClick={() => {
                setWeeklyAlerts(!weeklyAlerts);
                showToast(
                  !weeklyAlerts
                    ? 'Notificações semanais ativadas!'
                    : 'Notificações pausadas'
                );
              }}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                weeklyAlerts ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  weeklyAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#003366] flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-[#0055A5]" />
                Meus Eventos Salvos
              </h3>
              <span className="text-xs font-bold text-[#0055A5] tabular-nums">
                {savedEventsList.length}
              </span>
            </div>

            {savedEventsList.length > 0 ? (
              <div className="space-y-2">
                {savedEventsList.map((ev) => (
                  <button
                    type="button"
                    key={ev.id}
                    onClick={() => setModalEvent(ev)}
                    className="w-full text-left p-3 rounded-xl bg-[#F0F4F8] flex items-center justify-between gap-2 cursor-pointer hover:bg-blue-50"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#003366] truncate">
                        {ev.title}
                      </p>
                      <p className="text-[11px] text-slate-500 tabular-nums">
                        {ev.date.split('-').reverse().join('/')} · {ev.time}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                      Confirmado
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-3">
                Você ainda não salvou eventos. Explore a aba Eventos e toque em
                &ldquo;Confirmar Presença&rdquo;.
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/70 text-center space-y-2.5">
            <p className="text-xs font-bold text-[#003366]">
              É estudante, técnico ou docente da UFMS?
            </p>
            <p className="text-[11px] text-slate-500">
              Entre com seu Passaporte UFMS para contabilizar horas de extensão na
              PROECE automaticamente.
            </p>
            <button
              type="button"
              onClick={toggleUserMode}
              className="w-full py-2.5 px-4 rounded-xl bg-[#003366] hover:bg-[#0055A5] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Entrar no Modo Estudante (Sou UFMS)
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4 pb-6">
        {/* Mini-Cartão Identidade Estudantil Sou UFMS */}
        <div className="bg-gradient-to-br from-[#003366] via-[#004488] to-[#0055A5] rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-cyan-400/10" />
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200">
                Identidade Estudantil Sou UFMS
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-bold border border-emerald-300/30">
              Ativo
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#003366] font-extrabold text-lg flex items-center justify-center shadow shrink-0">
              LZ
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-extrabold leading-tight">Luiza</h2>
              <p className="text-xs text-blue-100">Ciências Sociais · FACH</p>
              <p className="text-[11px] font-mono text-cyan-200 mt-0.5 tabular-nums">
                RGA 202230050084
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 transition-colors cursor-pointer"
              title="QR Code Check-in"
              aria-label="Exibir QR Code para Check-in"
            >
              <QrCode className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contador Visual de Horas de Extensão */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/70 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Horas de Extensão no Autocine
              </h3>
              <p className="text-xl font-extrabold text-[#003366] mt-0.5 tabular-nums">
                6h{' '}
                <span className="text-sm font-semibold text-slate-400">
                  / 20h meta
                </span>
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-[#0055A5] to-emerald-500 rounded-full transition-all duration-500"
              style={{width: '30%'}}
            />
            {potentialHours > 0 && (
              <div
                className="h-full bg-emerald-300/60 transition-all duration-500"
                style={{width: `${Math.min((potentialHours / 20) * 100, 70)}%`}}
              />
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] tabular-nums">
            <span className="text-emerald-700 font-semibold">
              30% concluído (PROECE)
            </span>
            {potentialHours > 0 && (
              <span className="text-[#0055A5] font-semibold">
                +{potentialHours}h previstas na agenda
              </span>
            )}
          </div>
        </div>

        {/* Agenda Confirmada */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/70 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#003366]">
              Minha Agenda Confirmada
            </h3>
            <span className="text-xs font-bold text-[#0055A5] tabular-nums">
              {savedEventsList.length}
            </span>
          </div>

          {savedEventsList.length > 0 ? (
            <div className="space-y-2">
              {savedEventsList.map((ev) => (
                <button
                  type="button"
                  key={ev.id}
                  onClick={() => setModalEvent(ev)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#F0F4F8] flex items-center justify-between gap-2 cursor-pointer hover:bg-blue-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#003366] truncate">
                      {ev.title}
                    </p>
                    <p className="text-[11px] text-slate-500 tabular-nums">
                      {ev.date.split('-').reverse().join('/')} · {ev.time}
                    </p>
                  </div>
                  {ev.extensionBadge && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold tabular-nums">
                      +{ev.extensionHours}h
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Nenhum evento salvo ainda.</p>
          )}
        </div>

        {/* Certificados Validados Automaticamente */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/70 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#003366]">
              Certificados Validados (PROECE)
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Sincronizado
            </span>
          </div>

          <div className="space-y-2">
            {VALIDATED_CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {cert.title}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 tabular-nums">
                    {cert.date} · Cód. {cert.code}
                  </p>
                </div>
                <span className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-extrabold tabular-nums">
                  +{cert.hours}h
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-[#07192d] to-slate-900 flex flex-col items-center justify-center sm:p-4 antialiased">
      {/* Frame do Smartphone Moderno (390x844px) */}
      <div className="relative w-full h-screen sm:w-[390px] sm:h-[844px] sm:max-h-[95vh] bg-[#F0F4F8] sm:rounded-[46px] sm:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.65)] sm:border-[8px] sm:border-slate-800 overflow-hidden flex flex-col">
        {/* Barra de Status */}
        <div className="relative bg-[#003366] text-white px-6 pt-3 pb-1.5 flex items-center justify-between text-[11px] font-semibold shrink-0 tabular-nums">
          <span>18:30</span>
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-2 w-24 h-5 bg-black rounded-full" />
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Cabeçalho Fixo Institucional */}
        <header className="bg-gradient-to-r from-[#003366] to-[#0055A5] text-white px-4 pt-2 pb-3 shadow-md shrink-0 z-20">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Film className="w-5 h-5 text-cyan-300" />
              </div>
              <div className="min-w-0">
                <span className="block text-sm font-black tracking-tight leading-tight whitespace-nowrap">
                  UFMS CULTURA
                </span>
                <p className="text-[10px] text-blue-100/90 truncate">
                  Autocine UFMS · Campo Grande
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleUserMode}
              className={`shrink-0 px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap cursor-pointer ${
                userMode === 'student'
                  ? 'bg-white text-[#003366] border-white shadow-sm'
                  : 'bg-cyan-400/20 text-cyan-100 border-cyan-300/40'
              }`}
              title="Alternar entre Modo Estudante e Comunidade Externa"
            >
              {userMode === 'student' ? (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-[#0055A5] shrink-0" />
                  <span>Estudante (Logado)</span>
                </>
              ) : (
                <>
                  <Users className="w-3.5 h-3.5 text-cyan-200 shrink-0" />
                  <span>Comunidade Externa</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Área de Conteúdo Rolável */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {activeTab === 'events' && renderEventsTab()}
          {activeTab === 'calendar' && renderCalendarTab()}
          {activeTab === 'map' && renderMapTab()}
          {activeTab === 'profile' && renderProfileTab()}
        </main>

        {/* Barra de Navegação Inferior Fixa */}
        <nav className="bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 pt-2 pb-4 sm:pb-5 shrink-0 z-20">
          <div className="grid grid-cols-4 gap-1">
            {(
              [
                {id: 'events', label: 'Eventos', icon: Sparkles},
                {id: 'calendar', label: 'Calendário', icon: CalendarIcon},
                {id: 'map', label: 'Mapa & Acesso', icon: MapPin},
                {
                  id: 'profile',
                  label:
                    userMode === 'student' ? 'Perfil / Ext.' : 'Salvos / Info',
                  icon: User,
                },
              ] as const
            ).map((tab) => {
              const IconComp = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
                    active
                      ? 'text-[#003366]'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {active && (
                    <span className="absolute -top-2 w-8 h-1 rounded-full bg-[#0055A5]" />
                  )}
                  <IconComp
                    className={`w-5 h-5 ${active ? 'stroke-[2.4]' : 'stroke-[1.8]'}`}
                  />
                  <span
                    className={`text-[10px] mt-1 whitespace-nowrap ${
                      active ? 'font-extrabold' : 'font-medium'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:block w-28 h-1 bg-slate-300 rounded-full mx-auto mt-2.5" />
        </nav>

        {/* Bottom Sheet Modal de Detalhes do Evento */}
        {modalEvent && (
          <div
            className="absolute inset-0 z-40 bg-slate-900/60 backdrop-blur-[2px] flex items-end justify-center"
            onClick={() => setModalEvent(null)}
          >
            <div
              className="w-full max-h-[86%] bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col animate-sheet-up"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const cat = CATEGORY_CONFIG[modalEvent.category];
                const IconComp = modalEvent.customIcon || cat.icon || Film;
                const grad =
                  modalEvent.customGradient ||
                  cat.gradient ||
                  'from-[#003366] to-[#0055A5]';

                return (
                  <div
                    className={`relative bg-gradient-to-r ${grad} px-5 pt-3 pb-5 text-white shrink-0`}
                  >
                    <div className="w-10 h-1 bg-white/40 rounded-full mx-auto mb-3" />
                    <button
                      type="button"
                      onClick={() => setModalEvent(null)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/25 hover:bg-black/40 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Fechar detalhes"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 mb-1.5 flex-wrap pr-10">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold">
                        <IconComp className="w-3 h-3" />
                        {modalEvent.tagLabel}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-black/25 text-[10px] font-bold tabular-nums">
                        Classificação: {modalEvent.ageRating}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold leading-snug pr-8">
                      {modalEvent.title}
                    </h3>
                    <p className="text-xs text-white/90 mt-0.5">
                      {modalEvent.subtitle}
                    </p>
                  </div>
                );
              })()}

              <div className="p-5 overflow-y-auto space-y-4 no-scrollbar">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#F0F4F8] rounded-xl p-2.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Horário
                    </span>
                    <span className="text-xs font-bold text-[#003366] flex items-center gap-1 mt-0.5 tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-[#0055A5] shrink-0" />
                      {modalEvent.time}
                    </span>
                  </div>
                  <div className="bg-[#F0F4F8] rounded-xl p-2.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Local
                    </span>
                    <span className="text-xs font-bold text-[#003366] flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#0055A5] shrink-0" />
                      <span className="truncate">{modalEvent.location}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Sobre a programação
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {modalEvent.synopsis}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                    Parceiros & Realização
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {modalEvent.partners.map((partner) => (
                      <span
                        key={partner}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/70"
                      >
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>

                {modalEvent.extensionBadge && userMode === 'student' ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-900">
                        {modalEvent.extensionBadge}
                      </p>
                      <p className="text-[11px] text-emerald-800/90 leading-snug mt-0.5">
                        Check-in via QR Code no local valida automaticamente suas
                        horas na PROECE.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-3 flex items-center gap-2.5">
                    <Info className="w-4 h-4 text-[#0055A5] shrink-0" />
                    <p className="text-[11px] text-slate-700">
                      Acesso gratuito e aberto à comunidade de Campo Grande/MS.
                    </p>
                  </div>
                )}

                <div className="flex gap-2.5 pt-1 pb-2">
                  <button
                    type="button"
                    onClick={() => toggleConfirmEvent(modalEvent.id)}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer whitespace-nowrap ${
                      confirmedIds.includes(modalEvent.id)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#003366] hover:bg-[#0055A5] text-white'
                    }`}
                  >
                    {confirmedIds.includes(modalEvent.id) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        Presença Confirmada ✓
                      </>
                    ) : (
                      <>
                        <Ticket className="w-4 h-4 shrink-0" />
                        Confirmar Presença / Salvar
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareEvent(modalEvent)}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Share2 className="w-4 h-4 shrink-0" />
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal QR Code PROECE (Modo Estudante) */}
        {showQrModal && (
          <div
            className="absolute inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowQrModal(false)}
          >
            <div
              className="w-full bg-white rounded-3xl p-5 text-center space-y-3 shadow-2xl animate-sheet-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#003366]">
                  Check-in PROECE · Sou UFMS
                </span>
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-500 cursor-pointer"
                  aria-label="Fechar QR Code"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="w-40 h-40 mx-auto rounded-2xl bg-[#F0F4F8] border-2 border-dashed border-[#0055A5] flex flex-col items-center justify-center gap-2">
                <QrCode className="w-20 h-20 text-[#003366]" />
                <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                  RGA 202230050084
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apresente este QR Code à equipe do{' '}
                <strong>Autocine UFMS</strong> ou escaneie o totem na entrada
                para validar horas de extensão automaticamente.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowQrModal(false);
                  showToast('QR Code validado para check-in no local!');
                }}
                className="w-full py-2.5 rounded-xl bg-[#003366] text-white text-xs font-bold cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </div>
        )}

        {/* Sheet de Escolha de Rota (Google Maps / Uber) sem window.open */}
        {showRouteSheet && (
          <div
            className="absolute inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowRouteSheet(false)}
          >
            <div
              className="w-full bg-white rounded-t-3xl p-5 space-y-3 shadow-2xl animate-sheet-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-[#003366]">
                    Como deseja ir ao Autocine UFMS?
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Av. Costa e Silva, s/n · Cidade Universitária, Campo Grande/MS
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRouteSheet(false)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-500 cursor-pointer"
                  aria-label="Fechar opções de rota"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Autocine+UFMS+Campo+Grande+MS"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setShowRouteSheet(false);
                    showToast('Rota no Google Maps pronta!');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#003366] text-white text-xs font-bold flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-cyan-300" />
                    Traçar rota no Google Maps
                  </span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>

                <a
                  href="https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=Cidade%20Universit%C3%A1ria%20UFMS%2C%20Campo%20Grande%20-%20MS"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setShowRouteSheet(false);
                    showToast('Destino definido: Baia Segura Portão Costa e Silva');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-emerald-400" />
                    Solicitar Uber até a Baia Segura
                  </span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Toast Flutuante de Feedback */}
        {toast && (
          <div className="absolute top-28 left-1/2 -translate-x-1/2 z-50 w-[86%] bg-slate-900/95 text-white px-3.5 py-2.5 rounded-2xl shadow-lg text-xs font-semibold flex items-center gap-2 border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-snug">{toast}</span>
          </div>
        )}
      </div>
    </div>
  );
}
