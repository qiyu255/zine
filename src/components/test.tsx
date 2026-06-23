// GridLayoutDemo.tsx

const cards = [
  { id: 1, title: '卡片 1', content: '基础卡片', span: 'col-span-1' },
  { id: 2, title: '卡片 2', content: '跨 2 列', span: 'col-span-2' },
  { id: 3, title: '卡片 3', content: '基础卡片', span: 'col-span-1' },
  { id: 4, title: '卡片 4', content: '跨 2 行', span: 'row-span-2' },
  { id: 5, title: '卡片 5', content: '基础卡片', span: 'col-span-1' },
  { id: 6, title: '卡片 6', content: '基础卡片', span: 'col-span-1' },
  { id: 7, title: '卡片 7', content: '基础卡片', span: 'col-span-1' },
  { id: 8, title: '卡片 8', content: '基础卡片', span: 'col-span-1' },
  { id: 9, title: '卡片 9', content: '基础卡片', span: 'col-span-1' },
];

const GridLayoutDemo = () => {
  // 核心：移除子元素之间的顶部间距，覆盖全局 .content 规则
  const cardBase = `
    bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow
    p-5 border border-gray-100 flex flex-col
    [&>*+*]:!mt-0
  `;

  return (
    <div class="p-6 max-w-7xl mx-auto not-content">
      <h2 class="text-3xl font-bold text-gray-800 mb-6">🧩 Preact + Tailwind Grid 布局演示</h2>

      <section class="mb-10">
        <h3 class="text-xl font-semibold text-gray-700 mb-3">1️⃣ 响应式网格</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.slice(0, 6).map((card) => (
            <div key={card.id} class={cardBase}>
              <h4 class="text-lg font-medium text-gray-800">{card.title}</h4>
              <p class="text-gray-500 mt-1">{card.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section class="mb-10">
        <h3 class="text-xl font-semibold text-gray-700 mb-3">2️⃣ 混合网格（跨列 / 跨行）</h3>
        <div class="grid grid-cols-3 gap-4 auto-rows-min">
          {cards.map((card) => (
            <div key={card.id} class={`${card.span} ${cardBase}`}>
              <h4 class="text-lg font-medium text-gray-800">{card.title}</h4>
              <p class="text-gray-500 mt-1">{card.content}</p>
              {card.span === 'row-span-2' && (
                <span class="mt-2 text-sm text-blue-500">↕ 跨 2 行</span>
              )}
              {card.span === 'col-span-2' && (
                <span class="mt-2 text-sm text-green-500">↔ 跨 2 列</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-gray-700 mb-3">3️⃣ 自适应宽度</h3>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
            <div
              key={num}
              class="bg-indigo-100 rounded-lg p-4 text-center text-indigo-800 font-medium hover:bg-indigo-200 transition h-20 flex items-center justify-center"
            >
              项 {num}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GridLayoutDemo;
