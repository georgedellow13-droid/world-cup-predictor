'use client';
import { useState, useEffect } from 'react';

const GROUPS: Record<string, { name: string; flag: string }[]> = {
  A: [{ name: 'Mexico', flag: '🇲🇽' }, { name: 'South Korea', flag: '🇰🇷' }, { name: 'South Africa', flag: '🇿🇦' }, { name: 'Czechia', flag: '🇨🇿' }],
  B: [{ name: 'Canada', flag: '🇨🇦' }, { name: 'Switzerland', flag: '🇨🇭' }, { name: 'Qatar', flag: '🇶🇦' }, { name: 'Bosnia-Herzegovina', flag: '🇧🇦' }],
  C: [{ name: 'Brazil', flag: '🇧🇷' }, { name: 'Morocco', flag: '🇲🇦' }, { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' }, { name: 'Haiti', flag: '🇭🇹' }],
  D: [{ name: 'USA', flag: '🇺🇸' }, { name: 'Paraguay', flag: '🇵🇾' }, { name: 'Australia', flag: '🇦🇺' }, { name: 'Turkiye', flag: '🇹🇷' }],
  E: [{ name: 'Germany', flag: '🇩🇪' }, { name: 'Ecuador', flag: '🇪🇨' }, { name: 'Ivory Coast', flag: '🇨🇮' }, { name: 'Curacao', flag: '🇨🇼' }],
  F: [{ name: 'Netherlands', flag: '🇳🇱' }, { name: 'Japan', flag: '🇯🇵' }, { name: 'Tunisia', flag: '🇹🇳' }, { name: 'Sweden', flag: '🇸🇪' }],
  G: [{ name: 'Belgium', flag: '🇧🇪' }, { name: 'Iran', flag: '🇮🇷' }, { name: 'Egypt', flag: '🇪🇬' }, { name: 'New Zealand', flag: '🇳🇿' }],
  H: [{ name: 'Spain', flag: '🇪🇸' }, { name: 'Uruguay', flag: '🇺🇾' }, { name: 'Saudi Arabia', flag: '🇸🇦' }, { name: 'Cape Verde', flag: '🇨🇻' }],
  I: [{ name: 'France', flag: '🇫🇷' }, { name: 'Senegal', flag: '🇸🇳' }, { name: 'Norway', flag: '🇳🇴' }, { name: 'Iraq', flag: '🇮🇶' }],
  J: [{ name: 'Argentina', flag: '🇦🇷' }, { name: 'Austria', flag: '🇦🇹' }, { name: 'Algeria', flag: '🇩🇿' }, { name: 'Jordan', flag: '🇯🇴' }],
  K: [{ name: 'Portugal', flag: '🇵🇹' }, { name: 'Colombia', flag: '🇨🇴' }, { name: 'Uzbekistan', flag: '🇺🇿' }, { name: 'DR Congo', flag: '🇨🇩' }],
  L: [{ name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, { name: 'Croatia', flag: '🇭🇷' }, { name: 'Panama', flag: '🇵🇦' }, { name: 'Ghana', flag: '🇬🇭' }],
};

const FIXTURES: Record<string, { home: string; away: string; date: string; time: string }[]> = {
  A: [
    { home: 'Mexico', away: 'South Africa', date: 'Thu 11 Jun', time: '20:00' },
    { home: 'South Korea', away: 'Czechia', date: 'Thu 11 Jun', time: '23:00' },
    { home: 'Mexico', away: 'Czechia', date: 'Mon 16 Jun', time: '20:00' },
    { home: 'South Africa', away: 'South Korea', date: 'Mon 16 Jun', time: '23:00' },
    { home: 'Mexico', away: 'South Korea', date: 'Fri 20 Jun', time: '20:00' },
    { home: 'Czechia', away: 'South Africa', date: 'Fri 20 Jun', time: '20:00' },
  ],
  B: [
    { home: 'Canada', away: 'Switzerland', date: 'Fri 12 Jun', time: '17:00' },
    { home: 'Qatar', away: 'Bosnia-Herzegovina', date: 'Fri 12 Jun', time: '20:00' },
    { home: 'Canada', away: 'Bosnia-Herzegovina', date: 'Tue 17 Jun', time: '17:00' },
    { home: 'Switzerland', away: 'Qatar', date: 'Tue 17 Jun', time: '20:00' },
    { home: 'Canada', away: 'Qatar', date: 'Sat 21 Jun', time: '20:00' },
    { home: 'Bosnia-Herzegovina', away: 'Switzerland', date: 'Sat 21 Jun', time: '20:00' },
  ],
  C: [
    { home: 'Brazil', away: 'Morocco', date: 'Fri 12 Jun', time: '23:00' },
    { home: 'Scotland', away: 'Haiti', date: 'Sat 13 Jun', time: '02:00' },
    { home: 'Brazil', away: 'Haiti', date: 'Wed 18 Jun', time: '23:00' },
    { home: 'Morocco', away: 'Scotland', date: 'Wed 18 Jun', time: '20:00' },
    { home: 'Brazil', away: 'Scotland', date: 'Sun 22 Jun', time: '20:00' },
    { home: 'Haiti', away: 'Morocco', date: 'Sun 22 Jun', time: '20:00' },
  ],
  D: [
    { home: 'USA', away: 'Paraguay', date: 'Sat 13 Jun', time: '20:00' },
    { home: 'Australia', away: 'Turkiye', date: 'Sat 13 Jun', time: '17:00' },
    { home: 'USA', away: 'Turkiye', date: 'Wed 18 Jun', time: '17:00' },
    { home: 'Paraguay', away: 'Australia', date: 'Thu 19 Jun', time: '02:00' },
    { home: 'USA', away: 'Australia', date: 'Mon 23 Jun', time: '20:00' },
    { home: 'Turkiye', away: 'Paraguay', date: 'Mon 23 Jun', time: '20:00' },
  ],
  E: [
    { home: 'Germany', away: 'Ecuador', date: 'Sun 14 Jun', time: '17:00' },
    { home: 'Ivory Coast', away: 'Curacao', date: 'Sun 14 Jun', time: '20:00' },
    { home: 'Germany', away: 'Curacao', date: 'Thu 19 Jun', time: '20:00' },
    { home: 'Ecuador', away: 'Ivory Coast', date: 'Thu 19 Jun', time: '17:00' },
    { home: 'Germany', away: 'Ivory Coast', date: 'Tue 24 Jun', time: '20:00' },
    { home: 'Curacao', away: 'Ecuador', date: 'Tue 24 Jun', time: '20:00' },
  ],
  F: [
    { home: 'Netherlands', away: 'Japan', date: 'Sun 14 Jun', time: '23:00' },
    { home: 'Tunisia', away: 'Sweden', date: 'Mon 15 Jun', time: '02:00' },
    { home: 'Netherlands', away: 'Sweden', date: 'Fri 20 Jun', time: '23:00' },
    { home: 'Japan', away: 'Tunisia', date: 'Fri 20 Jun', time: '17:00' },
    { home: 'Netherlands', away: 'Tunisia', date: 'Wed 25 Jun', time: '20:00' },
    { home: 'Sweden', away: 'Japan', date: 'Wed 25 Jun', time: '20:00' },
  ],
  G: [
    { home: 'Belgium', away: 'Egypt', date: 'Mon 15 Jun', time: '17:00' },
    { home: 'Iran', away: 'New Zealand', date: 'Mon 15 Jun', time: '20:00' },
    { home: 'Belgium', away: 'New Zealand', date: 'Sat 21 Jun', time: '17:00' },
    { home: 'Egypt', away: 'Iran', date: 'Sat 21 Jun', time: '23:00' },
    { home: 'Belgium', away: 'Iran', date: 'Thu 26 Jun', time: '20:00' },
    { home: 'New Zealand', away: 'Egypt', date: 'Thu 26 Jun', time: '20:00' },
  ],
  H: [
    { home: 'Spain', away: 'Uruguay', date: 'Mon 15 Jun', time: '23:00' },
    { home: 'Saudi Arabia', away: 'Cape Verde', date: 'Tue 16 Jun', time: '02:00' },
    { home: 'Spain', away: 'Cape Verde', date: 'Sun 22 Jun', time: '17:00' },
    { home: 'Uruguay', away: 'Saudi Arabia', date: 'Sun 22 Jun', time: '23:00' },
    { home: 'Spain', away: 'Saudi Arabia', date: 'Fri 27 Jun', time: '20:00' },
    { home: 'Cape Verde', away: 'Uruguay', date: 'Fri 27 Jun', time: '20:00' },
  ],
  I: [
    { home: 'France', away: 'Senegal', date: 'Tue 16 Jun', time: '20:00' },
    { home: 'Norway', away: 'Iraq', date: 'Tue 16 Jun', time: '17:00' },
    { home: 'France', away: 'Iraq', date: 'Mon 23 Jun', time: '17:00' },
    { home: 'Senegal', away: 'Norway', date: 'Mon 23 Jun', time: '23:00' },
    { home: 'France', away: 'Norway', date: 'Sat 28 Jun', time: '20:00' },
    { home: 'Iraq', away: 'Senegal', date: 'Sat 28 Jun', time: '20:00' },
  ],
  J: [
    { home: 'Argentina', away: 'Algeria', date: 'Wed 17 Jun', time: '20:00' },
    { home: 'Austria', away: 'Jordan', date: 'Wed 17 Jun', time: '17:00' },
    { home: 'Argentina', away: 'Jordan', date: 'Tue 24 Jun', time: '17:00' },
    { home: 'Algeria', away: 'Austria', date: 'Tue 24 Jun', time: '23:00' },
    { home: 'Argentina', away: 'Austria', date: 'Sun 29 Jun', time: '20:00' },
    { home: 'Jordan', away: 'Algeria', date: 'Sun 29 Jun', time: '20:00' },
  ],
  K: [
    { home: 'Portugal', away: 'Colombia', date: 'Thu 18 Jun', time: '20:00' },
    { home: 'Uzbekistan', away: 'DR Congo', date: 'Thu 18 Jun', time: '17:00' },
    { home: 'Portugal', away: 'DR Congo', date: 'Wed 25 Jun', time: '17:00' },
    { home: 'Colombia', away: 'Uzbekistan', date: 'Wed 25 Jun', time: '23:00' },
    { home: 'Portugal', away: 'Uzbekistan', date: 'Mon 30 Jun', time: '20:00' },
    { home: 'DR Congo', away: 'Colombia', date: 'Mon 30 Jun', time: '20:00' },
  ],
  L: [
    { home: 'England', away: 'Croatia', date: 'Wed 17 Jun', time: '21:00' },
    { home: 'Panama', away: 'Ghana', date: 'Wed 17 Jun', time: '18:00' },
    { home: 'England', away: 'Ghana', date: 'Tue 23 Jun', time: '21:00' },
    { home: 'Croatia', away: 'Panama', date: 'Tue 23 Jun', time: '18:00' },
    { home: 'England', away: 'Panama', date: 'Sat 27 Jun', time: '22:00' },
    { home: 'Ghana', away: 'Croatia', date: 'Sat 27 Jun', time: '22:00' },
  ],
};

const SQUADS: Record<string, { name: string; position: string; club: string; number: number }[]> = {
  England: [
    { number: 1, name: 'Jordan Pickford', position: 'GK', club: 'Everton' },
    { number: 2, name: 'Ezri Konsa', position: 'DEF', club: 'Aston Villa' },
    { number: 3, name: "Nico O'Reilly", position: 'DEF', club: 'Man City' },
    { number: 4, name: 'Declan Rice', position: 'MID', club: 'Arsenal' },
    { number: 5, name: 'John Stones', position: 'DEF', club: 'Man City' },
    { number: 6, name: 'Marc Guéhi', position: 'DEF', club: 'Crystal Palace' },
    { number: 7, name: 'Bukayo Saka', position: 'FWD', club: 'Arsenal' },
    { number: 8, name: 'Elliot Anderson', position: 'MID', club: 'Newcastle' },
    { number: 9, name: 'Harry Kane', position: 'FWD', club: 'Bayern Munich' },
    { number: 10, name: 'Jude Bellingham', position: 'MID', club: 'Real Madrid' },
    { number: 11, name: 'Marcus Rashford', position: 'FWD', club: 'Man Utd' },
    { number: 12, name: 'Tino Livramento', position: 'DEF', club: 'Newcastle' },
    { number: 13, name: 'Dean Henderson', position: 'GK', club: 'Crystal Palace' },
    { number: 14, name: 'Jordan Henderson', position: 'MID', club: 'Ajax' },
    { number: 15, name: 'Dan Burn', position: 'DEF', club: 'Newcastle' },
    { number: 16, name: 'Kobbie Mainoo', position: 'MID', club: 'Man Utd' },
    { number: 17, name: 'Morgan Rogers', position: 'MID', club: 'Aston Villa' },
    { number: 18, name: 'Anthony Gordon', position: 'FWD', club: 'Newcastle' },
    { number: 19, name: 'Ollie Watkins', position: 'FWD', club: 'Aston Villa' },
    { number: 20, name: 'Noni Madueke', position: 'FWD', club: 'Chelsea' },
    { number: 21, name: 'Eberechi Eze', position: 'MID', club: 'Crystal Palace' },
    { number: 22, name: 'Ivan Toney', position: 'FWD', club: 'Al-Ahli' },
    { number: 23, name: 'James Trafford', position: 'GK', club: 'Burnley' },
    { number: 24, name: 'Reece James', position: 'DEF', club: 'Chelsea' },
    { number: 25, name: 'Djed Spence', position: 'DEF', club: 'Spurs' },
    { number: 26, name: 'Jarell Quansah', position: 'DEF', club: 'Liverpool' },
  ],
};

const FORMATIONS = ['4-3-3', '4-4-2', '4-2-3-1', '4-5-1', '4-1-4-1', '3-5-2', '3-4-3', '3-6-1', '5-3-2', '5-4-1'];

function getFormationSlots(formation: string): { pos: string; x: number; y: number }[] {
  const slots: { pos: string; x: number; y: number }[] = [];
  slots.push({ pos: 'GK', x: 50, y: 88 });

  const lines = formation.split('-').map(Number);
  const totalLines = lines.length;
  const rowY = [72, 55, 38, 22, 10];

  lines.forEach((count, lineIdx) => {
    const y = rowY[lineIdx];
    let names: string[];

    if (lineIdx === 0) {
      if (count === 3) names = ['LB', 'CB', 'RB'];
      else if (count === 4) names = ['LB', 'CB', 'CB', 'RB'];
      else if (count === 5) names = ['LB', 'CB', 'CB', 'CB', 'RB'];
      else names = Array(count).fill('CB');
    } else if (lineIdx === totalLines - 1) {
      if (count === 1) names = ['ST'];
      else if (count === 2) names = ['ST', 'ST'];
      else if (count === 3) names = ['LW', 'ST', 'RW'];
      else names = Array(count).fill('FW');
    } else {
      if (count === 1) names = ['DM'];
      else if (count === 2) names = ['CM', 'CM'];
      else if (count === 3) names = ['CM', 'CM', 'CM'];
      else if (count === 4) names = ['LM', 'CM', 'CM', 'RM'];
      else if (count === 5) names = ['LM', 'CM', 'CM', 'CM', 'RM'];
      else if (count === 6) names = ['LM', 'CM', 'CM', 'CM', 'CM', 'RM'];
      else names = Array(count).fill('CM');
    }

    for (let i = 0; i < count; i++) {
      const x = ((i + 1) / (count + 1)) * 100;
      slots.push({ pos: names[i], x, y });
    }
  });

  return slots;
}

type Predictions = Record<string, { home: string; away: string }>;
type Player = { name: string; position: string; club: string; number: number };

interface Match {
  id: number;
  utcDate: string;
  status: string;
  minute?: number;
  stage: string;
  group?: string;
  homeTeam: { name: string; shortName: string };
  awayTeam: { name: string; shortName: string };
  score: {
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
}

function getGroupLetter(match: Match): string {
  if (!match.group) return '';
  return match.group.replace('GROUP_', '');
}

function getStatusLabel(match: Match) {
  if (match.status === 'IN_PROGRESS' || match.status === 'PAUSED') {
    return { text: match.minute ? `${match.minute}'` : 'LIVE', color: 'text-red-400', live: true };
  }
  if (match.status === 'FINISHED') {
    return { text: 'FT', color: 'text-gray-400', live: false };
  }
  const date = new Date(match.utcDate);
  return {
    text: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }),
    color: 'text-gray-400',
    live: false,
  };
}

export default function Dashboard({ username }: { username: string }) {
  const [activeTab, setActiveTab] = useState('Live Scores');
  const [activeGroup, setActiveGroup] = useState('A');
  const [squadTeam, setSquadTeam] = useState('England');
  const [formation, setFormation] = useState('4-3-3');
  const [selectedPlayers, setSelectedPlayers] = useState<Record<number, Player>>({});
  const [pickingSlot, setPickingSlot] = useState<number | null>(null);
  const [predictions, setPredictions] = useState<Predictions>({});
  const [groupDone, setGroupDone] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  const tabs = ['Live Scores', 'Predictions', 'Bracket', 'Squad'];
  const allTeams = Object.values(GROUPS).flat().map(t => t.name).sort();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch('/api/matches');
        const data = await res.json();
        if (data.matches) setMatches(data.matches);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
    const interval = setInterval(fetchMatches, 60000);
    return () => clearInterval(interval);
  }, []);

  const groupMatches = matches.filter(m => getGroupLetter(m) === activeGroup);

  const updatePrediction = (key: string, side: 'home' | 'away', val: string) => {
    setPredictions(prev => ({ ...prev, [key]: { ...prev[key], [side]: val } }));
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">⚽ World Cup Tracker</h1>
        <span className="text-green-400 text-sm font-medium">👤 {username}</span>
      </div>

      <div className="flex border-b border-gray-700 bg-gray-800">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-semibold tracking-wide ${activeTab === tab ? 'border-b-2 border-green-400 text-green-400' : 'text-gray-400'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4">

        {selectedMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-end justify-center" onClick={() => setSelectedMatch(null)}>
            <div className="bg-gray-800 w-full max-w-lg rounded-t-2xl p-5" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-base">{selectedMatch.homeTeam.shortName} vs {selectedMatch.awayTeam.shortName}</h2>
                <button onClick={() => setSelectedMatch(null)} className="text-gray-400 text-xl">✕</button>
              </div>
              <div className="text-center text-3xl font-bold mb-2">
                {selectedMatch.score.fullTime.home ?? '-'} – {selectedMatch.score.fullTime.away ?? '-'}
              </div>
              <div className="text-center text-xs text-gray-400 mb-4">{getStatusLabel(selectedMatch).text}</div>
              <div className="text-center text-gray-500 text-sm py-4">
                {selectedMatch.status === 'TIMED' || selectedMatch.status === 'SCHEDULED'
                  ? '⏳ Match not started yet.'
                  : '📋 Match events coming soon.'}
              </div>
            </div>
          </div>
        )}

        {pickingSlot !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-end justify-center" onClick={() => setPickingSlot(null)}>
            <div className="bg-gray-800 w-full max-w-lg rounded-t-2xl p-4 max-h-96 overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">Pick a player</h3>
                <button onClick={() => setPickingSlot(null)} className="text-gray-400 text-xl">✕</button>
              </div>
              {SQUADS[squadTeam]
                .filter(p => !Object.values(selectedPlayers).find(sp => sp?.number === p.number))
                .map((p, i) => (
                  <div key={i}
                    onClick={() => { setSelectedPlayers(prev => ({ ...prev, [pickingSlot!]: p })); setPickingSlot(null); }}
                    className="flex items-center px-3 py-3 border-t border-gray-700 cursor-pointer hover:bg-gray-700">
                    <span className="text-gray-500 text-xs w-6">{p.number}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-gray-400">{p.club}</div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      p.position === 'GK' ? 'bg-yellow-600 text-yellow-100' :
                      p.position === 'DEF' ? 'bg-blue-600 text-blue-100' :
                      p.position === 'MID' ? 'bg-green-700 text-green-100' :
                      'bg-red-700 text-red-100'}`}>{p.position}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'Live Scores' && (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(GROUPS).map(g => (
                <button key={g} onClick={() => setActiveGroup(g)}
                  className={`w-9 h-9 rounded-full text-sm font-bold ${activeGroup === g ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  {g}
                </button>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading...</div>
              ) : groupMatches.length > 0 ? (
                groupMatches.map(match => {
                  const status = getStatusLabel(match);
                  return (
                    <div key={match.id} onClick={() => setSelectedMatch(match)}
                      className="bg-gray-800 rounded-xl px-3 py-3 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold w-2/5 text-right">{match.homeTeam.shortName}</span>
                        <div className="w-1/5 text-center">
                          {match.status === 'TIMED' || match.status === 'SCHEDULED' ? (
                            <span className="text-xs text-gray-400">{status.text}</span>
                          ) : (
                            <span className="text-sm font-bold">{match.score.fullTime.home ?? 0} – {match.score.fullTime.away ?? 0}</span>
                          )}
                        </div>
                        <span className="text-sm font-semibold w-2/5 text-left pl-2">{match.awayTeam.shortName}</span>
                      </div>
                      <div className={`text-center text-xs mt-1 ${status.color}`}>
                        {status.live && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>}
                        {status.text}
                      </div>
                    </div>
                  );
                })
              ) : (
                FIXTURES[activeGroup].map((f, i) => (
                  <div key={i} className="bg-gray-800 rounded-xl px-3 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold w-2/5 text-right">{f.home}</span>
                      <span className="text-xs text-gray-400 text-center w-1/5">
                        <div>{f.date}</div><div>{f.time}</div>
                      </span>
                      <span className="text-sm font-semibold w-2/5 text-left pl-2">{f.away}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <h2 className="text-base font-bold mb-2">Group {activeGroup}</h2>
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="text-left px-3 py-2">Team</th>
                    <th className="py-2">MP</th><th className="py-2">W</th><th className="py-2">D</th><th className="py-2">L</th>
                    <th className="py-2">GF</th><th className="py-2">GA</th><th className="py-2">GD</th>
                    <th className="py-2 font-bold text-white">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {GROUPS[activeGroup].map((t, i) => (
                    <tr key={i} className="border-t border-gray-700">
                      <td className="px-3 py-2">{t.flag} {t.name}</td>
                      {[...Array(8)].map((_, j) => (
                        <td key={j} className={`text-center py-2 ${j === 7 ? 'font-bold' : 'text-gray-400'}`}>0</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'Predictions' && (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(GROUPS).map(g => (
                <button key={g} onClick={() => setActiveGroup(g)}
                  className={`w-9 h-9 rounded-full text-sm font-bold ${activeGroup === g ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  {g}
                </button>
              ))}
            </div>
            <div className="space-y-2 mb-6">
              {FIXTURES[activeGroup].map((f, i) => {
                const key = `${activeGroup}-${i}`;
                return (
                  <div key={i} className="bg-gray-800 rounded-xl px-3 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold w-2/5 text-right">{f.home}</span>
                      <div className="flex items-center gap-1 w-1/5 justify-center">
                        <input type="number" min="0" max="20" value={predictions[key]?.home ?? ''}
                          onChange={e => updatePrediction(key, 'home', e.target.value)}
                          className="w-8 text-center bg-gray-700 rounded text-white text-sm py-1" />
                        <span className="text-gray-400">-</span>
                        <input type="number" min="0" max="20" value={predictions[key]?.away ?? ''}
                          onChange={e => updatePrediction(key, 'away', e.target.value)}
                          className="w-8 text-center bg-gray-700 rounded text-white text-sm py-1" />
                      </div>
                      <span className="text-sm font-semibold w-2/5 text-left pl-2">{f.away}</span>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-1">{f.date} · {f.time}</div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setGroupDone(true)}
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl">
              ✅ Submit Group Stage Predictions
            </button>
          </>
        )}

        {activeTab === 'Bracket' && (
          !groupDone ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-xl font-bold mb-2">Bracket Locked</h2>
              <p className="text-gray-400 text-sm">Complete your group stage predictions first.</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🏆</div>
              <h2 className="text-xl font-bold mb-2">Knockout Bracket</h2>
              <p className="text-gray-400 text-sm">Coming soon!</p>
            </div>
          )
        )}

        {activeTab === 'Squad' && (
          <>
            <select value={squadTeam} onChange={e => { setSquadTeam(e.target.value); setSelectedPlayers({}); }}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl outline-none mb-3">
              {allTeams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            {SQUADS[squadTeam] ? (
              <>
                <select value={formation} onChange={e => { setFormation(e.target.value); setSelectedPlayers({}); }}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl outline-none mb-4">
                  {FORMATIONS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>

                <div className="relative bg-green-800 rounded-xl overflow-hidden" style={{ paddingBottom: '160%' }}>
                  <div className="absolute inset-0">
                    <div className="absolute inset-x-4 top-4 bottom-4 border border-white border-opacity-20 rounded"></div>
                    <div className="absolute left-1/2 top-1/2 w-20 h-20 border border-white border-opacity-20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute left-4 right-4 top-1/2 h-px bg-white opacity-20"></div>

                    {getFormationSlots(formation).map((slot, i) => {
                      const player = selectedPlayers[i];
                      return (
                        <div key={i}
                          style={{ position: 'absolute', left: `${slot.x}%`, top: `${slot.y}%`, transform: 'translate(-50%, -50%)' }}
                          onClick={() => setPickingSlot(i)}
                          className="flex flex-col items-center cursor-pointer">
                          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold ${player ? 'bg-white text-green-900 border-white' : 'bg-green-700 border-white border-opacity-60 text-white'}`}>
                            {player ? player.number : '+'}
                          </div>
                          <div className="text-white text-xs mt-1 text-center font-medium drop-shadow" style={{ maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {player ? player.name.split(' ').pop() : slot.pos}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button onClick={() => setSelectedPlayers({})}
                  className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-xl text-sm">
                  🔄 Reset lineup
                </button>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 mt-4">
                <div className="text-4xl mb-2">👕</div>
                <p>Squad data coming soon for {squadTeam}</p>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}