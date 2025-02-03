function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

fetch('data.json')
    .then(response => response.json())  // Mengubah response menjadi objek JSON
    .then(data => {
        const cardContainer = document.getElementById('card-container');
        const modal = document.getElementById('myModal');
        const modalImage = document.getElementById('modal-image');
        const modalDetails = document.getElementById('modal-details');
        const span = document.getElementsByClassName('close')[0];

        const shuffledAnime = shuffleArray(data.anime);

        // Mengakses data di dalam JSON dan membuat kartu
        function renderAnime(animeList){
            animeList.forEach(anime => {
                // Membuat elemen card
                const card = document.createElement('div');
                card.className = 'card';
    
                // Menambahkan gambar
                const img = document.createElement('img');
                img.src = anime.picture;
                img.alt = anime.title;
                card.appendChild(img);
    
                // Menambahkan judul
                const title = document.createElement('h2');
                title.textContent = anime.title;
                card.appendChild(title);
    
                // Event listener untuk menampilkan modal saat gambar diklik
                img.addEventListener('click', () => {
                    modal.style.display = 'block';
                    modalImage.src = anime.picture;  // Tampilkan gambar di modal
                    modalDetails.innerHTML = `
                        <h2>${anime.title}</h2>
                        <p>Studio: ${Array.isArray(anime.studio) ? anime.studio.join(", ") : anime.studio}</p>
                        <p>Genre: ${anime.genre.join(", ")}</p>
                        <p>Released: ${anime.release_date}</p>
                    `;
    
                    // Mengatur pagination untuk episode
                    const episodes = Array.from({ length: anime.episode }, (_, i) => i + 1); // Data episode
                    const episodesPerPage = 9; // 3x3 grid
                    let currentPage = 1;
    
                    const episodeList = document.createElement('ul');
                    episodeList.id = 'episode-list';
                    modalDetails.appendChild(episodeList);
    
                    const paginationControls = document.createElement('div');
                    paginationControls.id = 'pagination-controls';
                    paginationControls.innerHTML = `
                        <button id="prev-page" disabled>&lt; Prev</button>
                        <button id="next-page">&gt; Next</button>
                    `;
                    modalDetails.appendChild(paginationControls);
    
                    const prevButton = document.getElementById('prev-page');
                    const nextButton = document.getElementById('next-page');
    
                    function renderEpisodes() {
                        episodeList.innerHTML = ''; // Bersihkan list
    
                        const start = (currentPage - 1) * episodesPerPage;
                        const end = Math.min(start + episodesPerPage, episodes.length);
    
                        for (let i = start; i < end; i++) {
                            const li = document.createElement('li');
                            li.textContent = `Ep ${episodes[i]}`;
                            episodeList.appendChild(li);
                        }
    
                        prevButton.disabled = currentPage === 1;
                        nextButton.disabled = end >= episodes.length;
                    }
    
                    prevButton.addEventListener('click', () => {
                        if (currentPage > 1) {
                            currentPage--;
                            renderEpisodes();
                        }
                    });
    
                    nextButton.addEventListener('click', () => {
                        if (currentPage * episodesPerPage < episodes.length) {
                            currentPage++;
                            renderEpisodes();
                        }
                    });
    
                    renderEpisodes(); // Render halaman pertama
                });
    
                // Menambahkan card ke dalam container
                cardContainer.appendChild(card);
            });
        }

        // Menutup modal saat tombol "X" diklik
        span.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Menutup modal saat area di luar modal diklik
        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });

        const searchInput = document.querySelector('.search-box');
        searchInput.addEventListener('input', (event) => {
            const searchQuery = event.target.value.toLowerCase();
            filterCards(searchQuery);
        });

        function viewSearch(input) {
            const searchValue = document.getElementById('search_view');
            searchValue.textContent = `Search ${searchInput.value}`

        }

        function filterCards(query) {
            const cards = document.querySelectorAll('.card');
            
            cards.forEach(card => {
                const title = card.querySelector('h2').textContent.toLowerCase();
                
                if (title.includes(query)) {
                    card.style.display = 'block'; // Tampilkan card yang cocok
                } else {
                    card.style.display = 'none'; // Sembunyikan card yang tidak cocok
                }
            });
        }

        const categoryList = ["All", ...data.genre];
        let isCategory = false;
        const categoryContainer = document.getElementById("category-container");
        const btnCategory = document.getElementById("btnCategory");

        function renderCategory(){
            categoryContainer.innerHTML = "";
            categoryList.forEach(category => {
                const categoryButton = document.createElement("div");
                categoryButton.className = "category-btn";
                categoryButton.textContent = category;
                categoryButton.setAttribute("data-category", category);
                categoryButton.addEventListener("click", () => {
                    isCategory = false;
                    filterCategory(category);
                });
                categoryContainer.appendChild(categoryButton);
            })
        }

        function filterCategory(category){
            categoryContainer.style.display = "none";
            cardContainer.style.display = "flex";
            cardContainer.innerHTML = "";
            const filteredAnime = category === "All" ? shuffledAnime : shuffledAnime.filter(anime => anime.genre.includes(category));
            renderAnime(filteredAnime);
        }

        if(btnCategory){
            btnCategory.style.cursor = "pointer";
            btnCategory.addEventListener("click", () => {
                isCategory = true;
                categoryContainer.style.display = "flex";
                categoryContainer.style.flexWrap = "wrap";
                categoryContainer.style.justifyContent = "center"; // Rata tengah agar lebih rapi
                categoryContainer.style.gap = "10px"; // Beri jarak antar kategori
                cardContainer.style.display = "none";
            });
        }

        const btnHome =  document.getElementById("btnHome");
        if (btnHome){
            btnHome.style.cursor = "pointer";
            btnHome.addEventListener("click", () => {
                categoryContainer.style.display = "none";
                cardContainer.style.display = "flex";
            })
        }
        renderCategory();
        renderAnime(shuffledAnime)
    })
    .catch(error => {
        console.log('Error:', error);  // Menangani error jika fetch gagal
    });

    document.getElementById('search-box').addEventListener('input', function () {
        const searchValue = this.value.trim(); // Mengambil nilai input dan menghilangkan spasi di depan/belakang
        const searchResult = document.getElementById('search_anime');
    
        if (searchValue) {
            searchResult.textContent = `Search: ${searchValue}`;
        } else {
            searchResult.textContent = ''; // Kosongkan jika input kosong
        }
    });
