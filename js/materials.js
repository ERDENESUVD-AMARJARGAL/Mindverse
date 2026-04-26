const materials = [
  {
    title: "Алгебрийн үндэс",
    category: "Алгебр",
    desc: "Тэгшитгэл, тэнцэтгэл бус, олон гишүүнт зэрэг үндсэн ойлголтуудыг хамарсан PDF материал.",
    pages: 48, size: "2.3 MB",
    image: "../images/algebry.jpg",
    file: "#"
  },
  {
    title: "Геометрийн теорем",
    category: "Геометр",
    desc: "Евклидийн геометрийн теорем, нотолгоо, дасгал бодлогуудын цогц эмхэтгэл.",
    pages: 62, size: "3.1 MB",
    image: "../images/geometry.jpg",
    file: "#"
  },
  {
    title: "Тригонометрийн хүснэгт",
    category: "Тригонометр",
    desc: "Синус, косинус, тангенс нэгж тойргийн дэлгэрэнгүй хүснэгт болон томъёоны цуглуулга.",
    pages: 24, size: "1.1 MB",
    image: "../images/trignometry.jpg",
    file: "#"
  },
  {
    title: "Комбинаторикийн лекц",
    category: "Комбинаторик",
    desc: "Зөвшөөрөл, хослол, биномийн теорем зэрэг сэдвийг тайлбарлана.",
    pages: 36, size: "1.8 MB",
    image: "../images/data_analysis.jpg",
    file: "#"
  },
  {
    title: "Тооны онолын нотолгоо",
    category: "Тооны онол",
    desc: "Анхны тоо, хуваагдах чанар, Эйлерийн функц болон конгруенц сэдэвт материал.",
    pages: 52, size: "2.7 MB",
    image: "../images/geometry.png",
    file: "#"
  },
  {
    title: "Арифметикийн дасгал",
    category: "Арифметик",
    desc: "Үндсэн арифметик үйлдлүүдийн шийдлийн аргуудыг дасгал бодлогоор бататгана.",
    pages: 20, size: "0.9 MB",
    image: "../images/algebry.jpg",
    file: "#"
  },
  {
    title: "Алгебрийн бодлогын шийдлүүд",
    category: "Алгебр",
    desc: "ЭЕШ болон олимпиадын алгебрийн бодлогуудын дэлгэрэнгүй шийдлийн эмхэтгэл.",
    pages: 80, size: "4.2 MB",
    image: "../images/algebry.jpg",
    file: "#"
  },
  {
    title: "Геометрийн бодлого",
    category: "Геометр",
    desc: "Гурвалжин, дөрвөлжин, тойрог сэдэвт 100+ дасгал бодлого шийдэлтэй.",
    pages: 70, size: "3.6 MB",
    image: "../images/geometry.png",
    file: "#"
  },
  {
    title: "Тригонометрийн тэгшитгэл",
    category: "Тригонометр",
    desc: "Тригонометрийн тэгшитгэл болон тэнцэтгэл бусыг жишээ шийдлийн хамт авч үзнэ.",
    pages: 40, size: "2.0 MB",
    image: "../images/trignometry.jpg",
    file: "#"
  }
];

let activeCategory = 'all';

function renderMaterials(list) {
  const grid = document.getElementById('materialsGrid');
  grid.innerHTML = '';
  list.forEach(m => {
    const card = document.createElement('div');
    card.className = 'mat-item';
    card.innerHTML = `
      <img src="${m.image}" alt="${m.title}">
      <div class="mat-body">
        <span class="mat-tag">${m.category}</span>
        <h3>${m.title}</h3>
        <p>${m.desc}</p>
        <div class="mat-meta">
          <span><i class="fas fa-file-alt"></i> ${m.pages} хуудас</span>
          <span><i class="fas fa-download"></i> ${m.size}</span>
        </div>
        <a href="${m.file}" class="mat-btn"><i class="fas fa-download"></i> Татах</a>
      </div>`;
    grid.appendChild(card);
  });
  document.getElementById('mat-count').textContent = `Нийт ${list.length} материал`;
}

function applyFilters() {
  const q = document.getElementById('matSearch').value.toLowerCase();
  const filtered = materials.filter(m => {
    const catOk  = activeCategory === 'all' || m.category === activeCategory;
    const textOk = !q || m.title.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
    return catOk && textOk;
  });
  renderMaterials(filtered);
}

document.getElementById('filterTabs').addEventListener('click', e => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeCategory = btn.dataset.cat;
  applyFilters();
});

document.getElementById('matSearch').addEventListener('input', applyFilters);

renderMaterials(materials);
