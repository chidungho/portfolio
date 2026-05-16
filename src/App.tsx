import { useEffect } from 'react';
import Hls from 'hls.js';

export default function App() {
  useEffect(() => {
    // Xử lý Preloader chi tiết: chữ nhảy, số nhảy và trượt lên
    const preloader = document.getElementById('preloader');
    const loadingNumber = document.getElementById('loading-number');
    const loadingWord = document.getElementById('loading-word');
    const words = ["Inspire", "Create", "Design"];
    
    let counter = 50;
    let wordIndex = 0;
    
    if (preloader && loadingNumber && loadingWord) {
      const interval = setInterval(() => {
        counter += Math.floor(Math.random() * 5) + 1; // Tăng ngẫu nhiên từ 1-5
        if (counter >= 100) {
          counter = 100;
          clearInterval(interval);
          
          // Khi đến 100, đợi 1 chút rồi trượt màn hình preloader lên trên
          setTimeout(() => {
            preloader.style.transform = "translateY(-100%)";
            setTimeout(() => {
              preloader.style.display = 'none';
            }, 1200); // 1200ms bằng với transition duration
          }, 300);
        }
        
        // Thêm số 0 ở trước nếu cần (050 -> 100)
        loadingNumber.innerText = counter < 10 ? '00' + counter : (counter < 100 ? '0' + counter : counter.toString());
        
        // Đổi chữ "Inspire" -> "Create" -> "Design" tùy tiến độ
        if (counter > 65 && counter < 85 && wordIndex === 0) {
          wordIndex = 1;
          loadingWord.style.opacity = '0';
          setTimeout(() => { loadingWord.innerText = words[1]; loadingWord.style.opacity = '0.5'; }, 150);
        } else if (counter >= 85 && wordIndex === 1) {
          wordIndex = 2;
          loadingWord.style.opacity = '0';
          setTimeout(() => { loadingWord.innerText = words[2]; loadingWord.style.opacity = '0.5'; }, 150);
        }
        
      }, 40); // Tốc độ đếm số
      
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    // Kích hoạt Video nền như Image 2
    const video = document.getElementById('bg-video') as HTMLVideoElement;
    const source = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';
    
    let hls: Hls;
    if (video) {
        if (Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(source);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        }
    }
    
    return () => {
        if (hls) {
            hls.destroy();
        }
    }
  }, []);

  useEffect(() => {
    // Script Native cuộn mượt cho Navbar
    const links = document.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"], .hero-content-z a[href^="#"]');
    links.forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        if (targetId) {
            const target = document.querySelector(targetId);
            if (target) {
              target.scrollIntoView({ behavior: "smooth" });
            }
        }
      });
    });

    // Style active link khi scroll
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll<HTMLAnchorElement>("nav a[href^='#']");

    const onScroll = () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          current = section.getAttribute("id") || "";
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('text-white', 'bg-white/10', 'shadow-[0_0_15px_rgba(255,255,255,0.3)]');
        link.classList.add('text-muted');
        const href = link.getAttribute('href');
        if (href && current && href === '#' + current) {
          link.classList.remove('text-muted');
          link.classList.add('text-white', 'bg-white/10', 'shadow-[0_0_15px_rgba(255,255,255,0.3)]');
        }
      });
    };

    window.addEventListener('scroll', onScroll);
    window.dispatchEvent(new Event('scroll'));

    return () => {
        window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      {/* Preloader */}
      <div id="preloader" className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center transition-transform" style={{ transitionDuration: '1200ms', transitionTimingFunction: 'cubic-bezier(0.85,0,0.15,1)' }}>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Text ở giữa thay đổi (Inspire -> Create -> Design) */}
          <span id="loading-word" className="text-gray-500 font-display italic text-5xl md:text-7xl opacity-50 absolute transition-opacity duration-300">Inspire</span>
          
          {/* Số nhảy từ 0 đến 100 ở góc dưới phải */}
          <span id="loading-number" className="text-white font-body text-6xl md:text-8xl font-bold tracking-tight absolute bottom-8 right-8">00</span>
        </div>
      </div>

      {/* Navbar tĩnh chuẩn giao diện Image 2 */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
        <div className="inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface/80 px-2 py-2 shadow-lg transition-shadow">
          <div className="w-9 h-9 rounded-full flex items-center justify-center relative hover:scale-110 transition-transform">
            <div className="absolute inset-x-0 inset-y-0 rounded-full accent-gradient"></div>
            <div className="absolute inset-[2px] bg-bg rounded-full flex items-center justify-center">
              <span className="font-display italic text-[13px]">HC</span>
            </div>
          </div>
          <div className="w-px h-5 bg-stroke mx-3 hidden md:block"></div>
          <div className="flex gap-1">
            <a href="#home" className="text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-muted hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">Home</a>
            <a href="#about" className="text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-muted hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">About</a>
            <a href="#skills" className="text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-muted hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">Skills</a>
            <a href="#experience" className="text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-muted hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">Projects</a>
          </div>
          <div className="w-px h-5 bg-stroke mx-3"></div>
          <a href="#contact" className="relative group text-xs sm:text-sm rounded-full cursor-pointer text-white no-underline hover:text-white">
            <span className="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <div className="relative px-3 sm:px-4 py-1.5 sm:py-2 bg-surface rounded-full backdrop-blur-md flex items-center gap-1 hover:text-white transition-colors">
              Say hi ↗
            </div>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Hero Section (Nền Video HLS như Image 2 + Nội dung Dũng) */}
        <section id="home" className="hero-section text-center px-4">
          {/* HLS Video Background */}
          <video id="bg-video" autoPlay muted loop playsInline className="video-bg"></video>
          <div className="video-overlay"></div>
          
          <div className="hero-content-z flex flex-col items-center mt-10">
            <div className="text-xs text-muted uppercase tracking-[0.3em] mb-4 md:mb-8">PORTFOLIO '24</div>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-display italic leading-[0.9] tracking-tight mb-4 md:mb-6">Hồ Chí Dũng</h1>
            <div className="text-lg md:text-2xl mb-4 md:mb-6 text-white">Full Stack Developer</div>
            <p className="text-sm md:text-base text-muted max-w-lg mx-auto mb-8 md:mb-12 leading-relaxed">
              Sinh viên năm 3 tại Đại học Giao thông Vận tải TP.HCM, đam mê phát triển ứng dụng web. Làm việc hiệu quả với cả Frontend và Backend.
            </p>
            
            <div className="flex gap-4">
              <a href="#experience" className="group relative rounded-full text-sm px-6 py-3 bg-white text-black hover:bg-black hover:text-white transition-all hover:scale-105 overflow-hidden no-underline">
                 <span className="relative z-10">Xem Dự Án</span>
              </a>
              <a href="/downloadCV/HoChiDung.pdf" target="_blank" className="group relative rounded-full text-sm px-6 py-3 border border-white/20 text-white hover:border-white transition-all hover:scale-105 no-underline">
                 <span className="relative z-10">Download CV</span>
              </a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-24" style={{borderBottom: '1px solid #1f1f1f'}}>
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-stroke"></div>
              <div className="text-xs text-muted uppercase tracking-[0.2em]">GIỚI THIỆU</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-body mb-2 tracking-tight">Hồ Chí <span className="font-display italic text-gray-400">Dũng</span></h2>
            <p className="text-muted mb-12">Sinh viên đam mê phát triển web, không ngừng học hỏi và xây dựng sản phẩm.</p>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 flex justify-center md:justify-start">
                 <img src="/images/avatar.jpg" alt="Hồ Chí Dũng" className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full border border-stroke shadow-xl blur-[0.5px] hover:blur-none transition-all duration-500" />
              </div>
              <div className="md:w-2/3">
                 <div className="bg-surface border border-stroke rounded-[2rem] p-6 md:p-10 h-full hover:bg-[#1a1a1a] transition-colors duration-500">
                    <h4 className="text-2xl text-white mb-4">Tiểu Sử</h4>
                    <p className="text-muted leading-relaxed text-base md:text-lg mb-6">
                       Tôi là Hồ Chí Dũng, sinh viên năm 3 tại ĐH Giao thông Vận tải TP.HCM. 
                       Với khả năng làm việc cả Frontend và Backend, tôi luôn tìm kiếm cơ hội 
                       áp dụng kiến thức và học hỏi công nghệ mới.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted">
                       <li className="flex items-center gap-3"><i className="fas fa-birthday-cake text-gray-500"></i> 07/05/2005</li>
                       <li className="flex items-center gap-3"><i className="fas fa-home text-gray-500"></i> Khánh Hòa, Việt Nam</li>
                       <li className="flex items-center gap-3"><i className="fas fa-envelope text-gray-500"></i> dunghc0742@ut.edu.vn</li>
                       <li className="flex items-center gap-3"><i className="fas fa-phone text-gray-500"></i> 0365281925</li>
                    </ul>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-16 md:py-24" style={{borderBottom: '1px solid #1f1f1f'}}>
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center justify-between pl-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-stroke"></div>
                <div className="text-xs text-muted uppercase tracking-[0.2em]">KỸ NĂNG</div>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-body mb-2 tracking-tight pl-4">Ngôn ngữ & <span className="font-display italic text-gray-400">công cụ</span></h2>
            <p className="text-muted mb-12 pl-4">Các kỹ năng chuyên môn tôi đã trau dồi qua quá trình học tập và làm việc.</p>

            <div className="border border-stroke rounded-[2.5rem] bg-bg overflow-hidden flex flex-col group">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 border-b border-stroke hover:bg-surface transition-colors cursor-default">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 blur-[1px] shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                  <h4 className="text-xl md:text-2xl text-white font-medium">Python, JavaScript</h4>
                </div>
                <div className="flex gap-4 items-center mt-4 md:mt-0 text-muted text-sm md:text-base">
                  <span>Ngôn ngữ lập trình</span>
                  <span className="w-1 h-1 rounded-full bg-stroke"></span>
                  <span>95% & 85%</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 border-b border-stroke hover:bg-surface transition-colors cursor-default">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-500 blur-[1px] shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
                  <h4 className="text-xl md:text-2xl text-white font-medium">ReactJS, HTML/CSS</h4>
                </div>
                <div className="flex gap-4 items-center mt-4 md:mt-0 text-muted text-sm md:text-base">
                  <span>Frontend</span>
                  <span className="w-1 h-1 rounded-full bg-stroke"></span>
                  <span>85% & 90%</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 hover:bg-surface transition-colors cursor-default">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-green-500 to-emerald-700 blur-[1px] shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>
                  <h4 className="text-xl md:text-2xl text-white font-medium">Django, Node.js, Git</h4>
                </div>
                <div className="flex gap-4 items-center mt-4 md:mt-0 text-muted text-sm md:text-base">
                  <span>Backend & Tools</span>
                  <span className="w-1 h-1 rounded-full bg-stroke"></span>
                  <span>80-85%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="experience" className="py-16 md:py-24" style={{borderBottom: '1px solid #1f1f1f'}}>
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-stroke"></div>
              <div className="text-xs text-muted uppercase tracking-[0.2em]">SELECTED WORK</div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-body mb-2 tracking-tight">Dự án <span className="font-display italic text-gray-400">nổi bật</span></h2>
                <p className="text-muted">Các dự án tôi đã phát triển tử ý tưởng đến khi ra mắt.</p>
              </div>
              <a href="https://github.com/dunghc742" target="_blank" rel="noreferrer" className="px-6 py-2 rounded-full border border-stroke text-sm hover:bg-white hover:text-black transition-colors">
                Xem tất cả &rarr;
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="group block cursor-pointer">
                <div className="relative w-full aspect-[4/3] rounded-[2rem] bg-gradient-to-br from-blue-900 to-purple-900 overflow-hidden mb-6 border border-stroke flex items-center justify-center">
                   <h3 className="text-4xl font-bold text-white z-0 opacity-50">VacTrack V2</h3>
                   <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500"></div>
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a href="https://github.com/chidungho/vactrack-V2" target="_blank" rel="noreferrer" className="px-6 py-3 bg-surface/80 backdrop-blur-md rounded-full border border-white/10 text-white font-medium hover:bg-white hover:text-black transition-colors">
                        View — Digital Health Passport
                      </a>
                   </div>
                </div>
                <div className="px-2">
                  <h5 className="text-2xl text-white mb-2">Digital Health Passport</h5>
                  <p className="text-muted text-base">Quản lý hồ sơ tiêm chủng bằng Kotlin, Jetpack Compose, Firebase.</p>
                </div>
              </div>

              <div className="group block cursor-pointer">
                 <div className="relative w-full aspect-[4/3] rounded-[2rem] bg-gradient-to-br from-green-900 to-teal-900 overflow-hidden mb-6 border border-stroke flex items-center justify-center mt-0 md:mt-16">
                    <h3 className="text-4xl font-bold text-white z-0 opacity-50">Trợ Lý Ảo Python</h3>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <a href="https://github.com/chidungho/troliao" target="_blank" rel="noreferrer" className="px-6 py-3 bg-surface/80 backdrop-blur-md rounded-full border border-white/10 text-white font-medium hover:bg-white hover:text-black transition-colors">
                         View — AI & Keylogger
                       </a>
                    </div>
                 </div>
                 <div className="px-2">
                   <h5 className="text-2xl text-white mb-2">AI Assistant & Keylogger</h5>
                   <p className="text-muted text-base">Tích hợp nhận diện giọng nói, điều khiển máy tính qua Python AI.</p>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Marquee Section */}
        <section className="py-16 md:py-24 border-b border-stroke overflow-hidden relative w-full flex items-center">
          <div className="animate-marquee flex items-center">
            <h1 className="text-6xl md:text-[8rem] font-display italic text-transparent uppercase tracking-wider px-4" style={{WebkitTextStroke: '1px #888'}}>
              HỒ CHÍ DŨNG • <span className="font-body font-bold" style={{WebkitTextStroke: '1px #444'}}>FULL STACK DEVELOPER</span> • HỒ CHÍ DŨNG • <span className="font-body font-bold" style={{WebkitTextStroke: '1px #444'}}>FULL STACK DEVELOPER</span> • HỒ CHÍ DŨNG • <span className="font-body font-bold" style={{WebkitTextStroke: '1px #444'}}>FULL STACK DEVELOPER</span> •
            </h1>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-5">
           <div className="container text-center max-w-2xl mx-auto">
              <h2 className="text-4xl mb-4 font-display italic">Hãy kết nối</h2>
              <p className="text-muted mb-8">Bạn có dự án hoặc ý tưởng? Liên hệ ngay để cùng thảo luận.</p>
              <div className="flex justify-center gap-6 text-2xl">
                 <a href="https://github.com/dunghc742" className="text-white hover:text-gray-400" target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>
                 <a href="https://linkedin.com/in/hochidzung" className="text-white hover:text-blue-500" target="_blank" rel="noreferrer"><i className="fab fa-linkedin"></i></a>
                 <a href="https://www.facebook.com/cheesedung10" className="text-white hover:text-blue-600" target="_blank" rel="noreferrer"><i className="fab fa-facebook"></i></a>
                 <a href="mailto:dunghc0742@ut.edu.vn" className="text-white hover:text-red-400"><i className="fas fa-envelope"></i></a>
              </div>
              <p className="text-muted text-sm mt-12">&copy; 2024 Hồ Chí Dũng. Tất cả quyền được bảo lưu.</p>
           </div>
        </section>
      </main>
    </>
  );
}