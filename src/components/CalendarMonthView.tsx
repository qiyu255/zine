// file: CalendarMonthView.tsx
import { h } from 'preact';

// ----- 类型定义 -----
interface CalendarEvent {
  title: string;
  start: Date;
  end?: Date;
  cat?: string;
  color?: string;
  note?: string;
}

interface CalendarMarks {
  date: Date;
  holiday: string;
  workday: 0 | 1 | 2;
}

interface CalendarData {
  events: CalendarEvent[];
  marks: CalendarMarks[];
}

// ----- 工具函数 -----
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// 判断两个 Date 是否为同一天
function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// 生成日历网格数据（35 或 42 个格子）
function buildMonthCells(year: number, month: number) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  const cells: {
    day: number | null;
    monthType: 'prev' | 'current' | 'next';
    date: Date | null;
  }[] = [];

  // 上月填充
  const prevMonthStart = daysInPrevMonth - firstDay + 1;
  for (let i = 0; i < firstDay; i++) {
    const day = prevMonthStart + i;
    const date = new Date(year, month - 1, day);
    cells.push({ day, monthType: 'prev', date });
  }

  // 本月
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    cells.push({ day, monthType: 'current', date });
  }

  const totalSoFar = cells.length;
  if (totalSoFar <= 35) {
    // 补足 35 个
    const need = 35 - totalSoFar;
    for (let day = 1; day <= need; day++) {
      const date = new Date(year, month + 1, day);
      cells.push({ day, monthType: 'next', date });
    }
  } else {
    // 补足 42 个
    const remaining = 42 - cells.length;
    for (let day = 1; day <= remaining; day++) {
      const date = new Date(year, month + 1, day);
      cells.push({ day, monthType: 'next', date });
    }
  }

  return cells;
}

// ----- 模拟数据生成 -----
// 根据给定日期范围生成模拟的日程和节日数据
function getCalendarData(start: Date, end: Date): CalendarData {
  const events: CalendarEvent[] = [];
  const marks: CalendarMarks[] = [];

  // 从 start 到 end 遍历每一天（不包含 end）
  const current = new Date(start);
  while (current < end) {
    const year = current.getFullYear();
    const month = current.getMonth();
    const day = current.getDate();

    // ---------- 节日（marks）----------
    let holiday = '';
    // 中国常见节日（公历）
    if (month === 0 && day === 1) holiday = '元旦';
    else if (month === 1 && day === 14) holiday = '情人节';
    else if (month === 2 && day === 8) holiday = '妇女节';
    else if (month === 4 && day === 1) holiday = '劳动节';
    else if (month === 5 && day === 1) holiday = '儿童节';
    else if (month === 9 && day === 1) holiday = '国庆节';
    else if (month === 11 && day === 25) holiday = '圣诞节';

    // 父亲节（6月第三个星期日）
    if (month === 5) {
      const firstDay = new Date(year, 5, 1).getDay(); // 0=周日
      const thirdSunday = 1 + (7 - firstDay) % 7 + 14; // 第三个星期日
      if (day === thirdSunday) holiday = '父亲节';
    }

    // 母亲节（5月第二个星期日）
    if (month === 4) {
      const firstDay = new Date(year, 4, 1).getDay();
      const secondSunday = 1 + (7 - firstDay) % 7 + 7;
      if (day === secondSunday) holiday = '母亲节';
    }

    if (holiday) {
      marks.push({
        date: new Date(current),
        holiday,
        workday: 0, // 节日
      });
    }

    // ---------- 事件（events）----------
    // 每月 1 号：月度总结会议
    if (day === 1) {
      events.push({
        title: '月度总结会',
        start: new Date(year, month, day, 9, 0),
        color: '#4A90D9',
      });
    }
    // 每月 15 号：项目评审
    if (day === 15) {
      events.push({
        title: '项目评审',
        start: new Date(year, month, day, 14, 0),
        color: '#E67E22',
      });
    }
    // 每周三：团队站会（模拟）
    if (current.getDay() === 3) {
      events.push({
        title: '站会',
        start: new Date(year, month, day, 10, 0),
        color: '#27AE60',
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return { events, marks };
}

// ----- 子组件 -----
function WeekDays() {
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  return (
    <div className="grid grid-cols-7 text-sm gap-1 sm:gap-2 font-medium text-gray-500 dark:text-gray-400">
      {weekDays.map((day) => (
        <div class="p-1">
        <span key={day} className="l-lh text-center aspect-square">
          {day}
        </span></div>
      ))}
    </div>
  );
}

interface DayCellProps {
  day: number | null;
  monthType: 'prev' | 'current' | 'next';
  date: Date | null;
  isToday: boolean;
  events: CalendarEvent[];     // 该日的事件列表
  holiday: string | null;      // 该日的节日（若有）
}

function DayCell({ day, monthType, date, isToday, events, holiday }: DayCellProps) {
  const textColor =
    monthType === 'current'
      ? 'text-gray-900 dark:text-gray-100'
      : 'text-gray-400 dark:text-gray-600';

  const todayClasses = isToday
    ? 'bg-blue-300 text-white dark:bg-blue-800 dark:text-white rounded-lg'
    : '';

  // 如果 date 为 null，则隐藏内容（占位）
  const empty = date ? '' : 'invisible';

  // 最多显示 3 个事件，多余显示 "+N more"
  const displayEvents = events.slice(0, 3);
  const extraCount = events.length - 3;

  return (
    <div
      className={`
        flex flex-col p-1
        w-full
        text-sm sm:text-base
        ${textColor}
        ${empty}
        transition-colors duration-150
        cursor-default
        overflow-hidden
      `}
    >
      {/* 头部：日期（左） + 节日（右） */}
      <div className="flex justify-between items-baseline">
        <span className={`text-sm font-medium text-center h-lh aspect-square ${todayClasses}`}>{day}</span>
        {holiday && (
          <span className="text-xs text-red-500 dark:text-red-400 font-medium ml-1 whitespace-nowrap overflow-hidden">
            {holiday}
          </span>
        )}
      </div>

      {/* 事件列表 */}
      <div className="flex-1 overflow-hidden text-xs leading-tight mt-0.5">
        {displayEvents.map((ev, idx) => (
          <div
            key={idx}
            className="truncate"
            style={{ color: ev.color || 'inherit' }}
          >
            {ev.title}
          </div>
        ))}
        {extraCount > 0 && (
          <div className="text-gray-400 dark:text-gray-500">
            +{extraCount} more
          </div>
        )}
      </div>
    </div>
  );
}

interface DayGridProps {
  cells: ReturnType<typeof buildMonthCells>;
  today: Date;
  calendarData: CalendarData;
}

function DayGrid({ cells, today, calendarData }: DayGridProps) {
  // 建立日期到事件和节日的映射，便于快速查找
  const eventMap = new Map<string, CalendarEvent[]>();
  const markMap = new Map<string, string>(); // dateKey -> holiday

  // 遍历 events
  calendarData.events.forEach((ev) => {
    const key = `${ev.start.getFullYear()}-${ev.start.getMonth()}-${ev.start.getDate()}`;
    if (!eventMap.has(key)) eventMap.set(key, []);
    eventMap.get(key)!.push(ev);
  });

  // 遍历 marks（只取第一个节日，若有多个则合并）
  calendarData.marks.forEach((mark) => {
    const key = `${mark.date.getFullYear()}-${mark.date.getMonth()}-${mark.date.getDate()}`;
    // 若已有节日，用“/”合并（简单处理）
    if (markMap.has(key)) {
      markMap.set(key, `${markMap.get(key)}/${mark.holiday}`);
    } else {
      markMap.set(key, mark.holiday);
    }
  });

  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-2">
      {cells.map((cell, index) => {
        const isToday =
          cell.date !== null &&
          isSameDay(cell.date, today);

        let events: CalendarEvent[] = [];
        let holiday: string | null = null;

        if (cell.date) {
          const key = `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`;
          events = eventMap.get(key) || [];
          // 按开始时间排序（可选）
          events.sort((a, b) => a.start.getTime() - b.start.getTime());
          holiday = markMap.get(key) || null;
        }

        return (
          <DayCell
            key={index}
            day={cell.day}
            monthType={cell.monthType}
            date={cell.date}
            isToday={isToday}
            events={events}
            holiday={holiday}
          />
        );
      })}
    </div>
  );
}

interface CalendarHeaderProps {
  year: number;
  month: number;
}

function CalendarHeader({ year, month }: CalendarHeaderProps) {
  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];
  return (
    <div className="text-center text-lg font-semibold text-gray-800 dark:text-gray-200 py-2">
      {year}年 {monthNames[month]}
    </div>
  );
}

// ----- 主组件 -----
interface CalendarMonthViewProps {
  date: Date;
}

export default function CalendarMonthView({ date }: CalendarMonthViewProps) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();

  const cells = buildMonthCells(year, month);

  // 计算视图的起始和结束日期（用于获取数据）
  const start = cells[0].date!;
  const end = cells[cells.length - 1].date!;
  end.setTime(end.getTime() + 86400000);

  const calendarData = getCalendarData(start, end);

  if (cells.length === 35) {
    for (let i = 0; i < 7; i++) {
      cells.push({ day: 0, monthType: 'next', date: null });
    }
  }

  return (
    <div className="max-w-xxl mx-auto p-4 bg-white dark:bg-gray-900 rounded-sm shadow-md">
      <CalendarHeader year={year} month={month} />
      <WeekDays />
      <DayGrid cells={cells} today={today} calendarData={calendarData} />
    </div>
  );
}
