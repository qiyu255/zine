// 这是preact+tailwindcss实现的组件
// 修改 DayCell 组件， 改成日程表的风格，方格左上角显示日期， 右上角显示节日。然后接着列出日程事件
// 同时实现getCalendarData和相关接口

// file: CalendarMonthView.tsx

interface CalendarMonthViewProps {
  date: Date;
}

// ----- 工具函数 -----
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// 生成日历数据，返回 35 或 42 个元素
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
    // 占 5 行 → 填充下月日期直到填满 35 个格子
    const need = 35 - totalSoFar;
    for (let day = 1; day <= need; day++) {
      const date = new Date(year, month + 1, day);
      cells.push({ day, monthType: 'next', date });
    }
  } else {
    // 占 6 行 →  填充下月直到 42 个格子
    const remaining = 42 - cells.length;
    for (let day = 1; day <= remaining; day++) {
      const date = new Date(year, month + 1, day);
      cells.push({ day, monthType: 'next', date });
    }
  }

  return cells;
}


function WeekDays() {
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  return (
    <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
      {weekDays.map((day) => (
        <div key={day} className="py-2">
          {day}
        </div>
      ))}
    </div>
  );
};

interface DayCellProps {
  day: number | null;
  monthType: 'prev' | 'current' | 'next';
  date: Date | null;
  isToday: boolean;
}

function DayCell({ day, monthType, date, isToday }: DayCellProps) {

  const textColor =
    monthType === 'current'
      ? 'text-gray-900 dark:text-gray-100'
      : 'text-gray-400 dark:text-gray-600';

  const todayClasses = isToday
    ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white rounded-full'
    : 'hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full';

  const empty = date ? '' : 'invisible'

  return (
    <div
      className={`
        flex items-center justify-center
        w-full aspect-square
        text-sm sm:text-base
        ${textColor}
        ${todayClasses}
        ${empty}
        transition-colors duration-150
        cursor-default

      `}
    >
      {day}
    </div>
  );
};

interface DayGridProps {
  cells: ReturnType<typeof buildMonthCells>;
  today: Date;
}

function DayGrid({ cells, today }: DayGridProps) {
  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-2">
      {cells.map((cell, index) => {
        const isToday =
          cell.date !== null &&
          cell.date.getFullYear() === today.getFullYear() &&
          cell.date.getMonth() === today.getMonth() &&
          cell.date.getDate() === today.getDate();

        return (
          <DayCell
            key={index}
            day={cell.day}
            monthType={cell.monthType}
            date={cell.date}
            isToday={isToday}
          />
        );
      })}
    </div>
  );
};

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
};

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

// ----- 主组件 -----
export default function CalendarMonthView({ date }: CalendarMonthViewProps) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();

  const cells = buildMonthCells(year, month);
  const start = cells[0].date
  const end = cells[cells.length - 1].date as Date
  end.setTime(end.getTime() + 86400000)
  // getCalendarData(start,end) => CalendarData

  if (cells.length == 35) {
    while (cells.length < 42) {
      cells.push({ day: 0, monthType: 'next', date: null });
    }
  }

  return (
    // max-w-md mx-auto
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-900 rounded-sm shadow-md">
      <CalendarHeader year={year} month={month} />
      <WeekDays />
      <DayGrid cells={cells} today={today} />
    </div>
  );
}
