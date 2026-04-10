


// Load JSON and render cards
fetch('data/courses.json')
  .then(res => res.json())
  .then(data => {
    renderCourses(data);
    setupFilters(data);
  })
  .catch(err => console.error(err));

// Render cards
function renderCourses(courses) {
  const container = document.querySelector('.course-container');
  container.innerHTML = '';

  courses.forEach(course => {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML = `
      <div class="course-image-wrapper">
        <img src="${course.image}" class="course-image" />
        <div class="rating">★ ${course.rating} <small>(${course.students})</small></div>
        <div class="tags"><span class="tag">${course.level}</span><span class="tag">${course.category}</span></div>
        <div class="price-badge">${course.price === 0 ? 'Үнэгүй' : '$' + course.price}</div>
      </div>
      <h3 class="course-title">${course.title}</h3>
      <div class="instructor">
        <img src="images/geometry.png" class="instructor-avatar" />
        <span>Багш: ${course.instructor}</span>
      </div>
      <div class="course-info">
        <i class="bi bi-journal-plus"> ${course.lessons} хичээл</i>
        <i class="bi bi-alarm"> ${course.hours} цаг</i>
        <i class="bi bi-people-fill"> ${course.enrolled} сурагч</i>
      </div>
    `;
      card.addEventListener('click', () => {
      window.location.href = `temp.html?id=${course.id}`;
    });
    
    container.appendChild(card);

    // Card click → temp.html
    card.addEventListener('click', () => {
      const query = new URLSearchParams({
        title: course.title,
        level: course.level,
        category: course.category,
        price: course.price,
        instructor: course.instructor,
        rating: course.rating,
        lessons: course.lessons,
        hours: course.hours,
        enrolled: course.enrolled,
        image: course.image
      });
      window.location.href = `temp.html?${query.toString()}`;
    });
  });

  document.querySelector('#total_class strong').textContent = courses.length;
}

// Filters & Search
function setupFilters(courses) {
  const categoryButtons = document.querySelectorAll('.category-group button');
  const filterButtons = document.querySelectorAll('.filter-group .filter-btn');
  const levelSelect = document.getElementById('levelSelect');
  const searchInput = document.getElementById('classSearch');

  function applyFilters() {
    let filtered = [...courses];

    // Category
    const activeCategory = document.querySelector('.category-group button.active').textContent;
    if (activeCategory !== 'All') {
      filtered = filtered.filter(c => c.category === activeCategory);
    }

    // Level
    const selectedLevel = levelSelect.value;
    if (selectedLevel !== 'Бүх түвшин') {
      filtered = filtered.filter(c => c.level === selectedLevel);
    }

    // Price filter (Үнэгүй / Төлбөртэй)
    const activePriceBtn = document.querySelector('.filter-group .filter-btn.active').textContent;
    if (activePriceBtn === 'Үнэгүй') filtered = filtered.filter(c => c.price === 0);
    else if (activePriceBtn === 'Төлбөртэй') filtered = filtered.filter(c => c.price > 0);

    // Search
    const query = searchInput.value.toLowerCase();
    if (query) {
      filtered = filtered.filter(c => c.title.toLowerCase().includes(query));
    }

    renderCourses(filtered);
  }

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active')); // бүх товчоос active устгах
    btn.classList.add('active'); // дарсан товчийг active болгох
    applyFilters(); // filter-г шинэчилж ажиллуулах
  });
});

  levelSelect.addEventListener('change', applyFilters);
  searchInput.addEventListener('input', applyFilters);
}

