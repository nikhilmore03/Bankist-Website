'use strict';


//Learn more Button
const learnButton=document.querySelector('.btn--scroll-to');
const section1=document.querySelector("#section--1");
///////////////////////////////////////
// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs=document.querySelectorAll('.operations__tab');
const tabContainer=document.querySelector('.operations__tab-container');
const tabsContent=document.querySelectorAll('.operations__content');  

const nav=document.querySelector('.nav');
const header=document.querySelector('.header');
const navHeight=nav.getBoundingClientRect().height;

const allSection=document.querySelectorAll('.section');
const imgTargets=document.querySelectorAll('img[data-src]');






const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//Learn more Button
console.log(learnButton);
learnButton.addEventListener('click',function(e){
    section1.scrollIntoView({behavior:'smooth'});
})


// document.querySelectorAll('.nav__link').forEach(links=>{
//   links.addEventListener('click',function(e){
//     e.preventDefault();
//     const id=this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior:'smooth'});
//   })
// })
////Event Delegation---use case:useful for dynamically generated element
//1.Add EventListener to common parent element
//2.Determine which element originated event

document.querySelector('.nav__links').addEventListener('click',function(e){
  e.preventDefault();
  
  //Matching Stategy
  if(e.target.classList.contains('nav__link')){
    const id=e.target.getAttribute('href');
    //console.log(id);
     document.querySelector(id).scrollIntoView({behavior:'smooth'});
  }
})


//Building a tabbed component.
tabContainer.addEventListener('click',function(e){
  const clicked=e.target.closest('.operations__tab');

  if(!clicked) return;

  tabs.forEach(t=>t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t=>t.classList.remove('operations__content--active'));

  //Activate Button  
  clicked.classList.add('operations__tab--active');

  //Activate info:
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');

})

//Menu Fade Animation.
const handleHover=function(e){
 
  if(e.target.classList.contains('nav__link')){
    const link=e.target;
    const siblings=link.closest('.nav').querySelectorAll('.nav__link');
    const logo=link.closest('.nav').querySelector('img');

    siblings.forEach(el=>{
        if(el!=link) el.style.opacity=this;
    })
    logo.style.opacity=this;

  } 
}
//Passing arguments to event handler using bind method as it always take one argument i.e (e)
nav.addEventListener('mouseover',handleHover.bind(0.5));
nav.addEventListener('mouseout',handleHover.bind(1));


//Sticky events using Intersection Observer API
const stickyNav=function(entries){
  const [entry]=entries;
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver=new IntersectionObserver(stickyNav,{
  root:null,
  threshold:0,
  rootMargin:`-${navHeight}px`
})

headerObserver.observe(header);



//Reveals sections
const revealSection=function(entries,observer){
    const [entry]=entries;
    if(!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
}
const sectionObserver=new IntersectionObserver(revealSection,{
  root:null,
  threshold:0.15,
//  rootMargin:100px,
})

allSection.forEach(sec=>{
 // sec.classList.add('section--hidden');
  sectionObserver.observe(sec);
})


//Lazy loading images
const Loading=function(entries,observer){
  const [entry]=entries;
  if(!entry.isIntersecting) return;

  entry.target.src=entry.target.dataset.src;
  console.log(entry.target.src);
  entry.target.addEventListener('load',function(){
    entry.target.classList.remove('lazy-img');
  })

  observer.unobserve(entry.target);
}
const imgObserver=new IntersectionObserver(Loading,{
  root:null,
  threshold:0,
  rootMargin:'200px'
});

imgTargets.forEach(img=>imgObserver.observe(img));




//Slider
const Slider=function(){
const slides=document.querySelectorAll('.slide');

let curSlide=0;
let maxSlide=slides.length-1;
const slider=document.querySelector('.slider');
// slider.style.transform='scale(0.5) translateX(-800px)';
// slider.style.overflow='visible';
const buttonRight=document.querySelector('.slider__btn--right')
const buttonLeft=document.querySelector('.slider__btn--left')
const dotContainer=document.querySelector('.dots');
// slides.forEach((s,i)=>{
//   s.style.transform=`translateX(${i*100}%)`
// })
const createDots=function(){
  slides.forEach((_,i)=>{
     dotContainer.insertAdjacentHTML('beforeend',`<button class="dots__dot" data-slide="${i}"></button>`)
  })
}



const activateDots=function(slide){
  document.querySelectorAll('.dots__dot').forEach(dot=>{
    dot.classList.remove('dots__dot--active');
  })

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).
  classList.add('dots__dot--active');
}


const goToSLides=function(slide){
  slides.forEach((s,i)=>{
    s.style.transform=`translateX(${(i-slide)*100}%)`
  })

}


const nextSLide=function(){
  if(curSlide==maxSlide){
    curSlide=0
  }
  else{
    curSlide++;
  }
  goToSLides(curSlide);
  activateDots(curSlide);
}

const prevSlide=function(){
  if(curSlide>0){
    curSlide--;
  }
   else{
     curSlide=maxSlide;
   }
  goToSLides(curSlide);
  activateDots(curSlide);
}

const init=function(){
  goToSLides(0);
  createDots();
  activateDots(0);
}

init()
//Event Handlers

buttonRight.addEventListener('click',nextSLide)

buttonLeft.addEventListener('click',prevSlide);

document.addEventListener('keydown',function(e){
  if(e.key==='ArrowLeft') prevSlide();
  e.key==='ArrowRight' && nextSLide();

})

dotContainer.addEventListener('click',function(e){
  if(e.target.classList.contains('dots__dot')){
    const {slide}=e.target.dataset;   
    goToSLides(slide);  
    activateDots(slide);
  }
})
}
Slider();
/////////////////////////////////////////////////////////////////////////////////////////////
///Learning 
//////////////////////////////////////////////////////////////////////////////////////////
//Selecting Elements
//console.log(document.documentElement);

// const allSection=document.querySelectorAll('.section');//This returns NodeList which is not dynamic

// const allButtons=document.getElementsByTagName('button');//This return HTML collection which is dynamic in nature
// console.log(allButtons);


//creating and Inserting elements
//insertAdjacentHTML --Need to check 
// const message=document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML='We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button> ';

// const header=document.querySelector('.header');
// header.append(message);

// document.querySelector('.btn--close-cookie').addEventListener('click',function(){
//   message.remove();
//   //message.parentElement.removeChild(message);   old method
// });


// //Working with Styles
// //Inline styles 
// message.style.backgroundColor='#37383d';
// message.style.width='120%'

// console.log(getComputedStyle(message).height);

// message.style.height=parseFloat(getComputedStyle(message).height,10)+30 +'px';
// console.log(getComputedStyle(message).height);

// //channging color with setProperty.
// //document.documentElement.style.setProperty('--color-primary','orangered');

// //Attributes
// const logo=document.querySelector('.nav__logo');//only access standard property of elements
// console.log(logo.alt);
// console.log(logo.src);//gets absolute path


// //Non standard
// console.log(logo.getAttribute('Design'));
// logo.setAttribute('company','Bankist')
// console.log(logo.getAttribute('src'));//gets relative path


// //Data attributes
// console.log(logo.dataset.versionNumber);

// //Classes
// logo.classList.add('A','B');
// logo.classList.remove("A");
// logo.classList.toggle("A");
// logo.classList.contains("A");


// //Smooth Scrolling

// const learnButton=document.querySelector('.btn--scroll-to');
// const section1=document.querySelector("#section--1");
// console.log(learnButton);
// learnButton.addEventListener('click',function(e){
//     const s1cords=section1.getBoundingClientRect();
//     console.log(s1cords);

//       //Scrolling
//     //calculating coordinates
//     // window.scrollTo({
//     //   left:s1cords.left+window.pageXOffset,
//     //   top:s1cords.top+window.pageYOffset,
//     //   behavior:'smooth'
//     // })

//     section1.scrollIntoView({behavior:'smooth'});
// })

// //Event Handling

// const h1=document.querySelector('h1');
// const AlertH1=function(e){
//   console.log("Event has occured");
// }
// h1.addEventListener('mouseenter',AlertH1);

// setTimeout(()=>h1.removeEventListener('mouseenter',AlertH1),5000);


// //Event Bubbling

// const randomInt=(min,max)=>Math.floor(Math.random()* (max-min+1)+min);

// const randomColor=()=>
// `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`;

// console.log(randomColor(0,255));

// document.querySelector('.nav__link').addEventListener('click',function(e){
// this.style.backgroundColor=randomColor();
// e.preventDefault();
// console.log("Link",e.target);
// });

// document.querySelector('.nav__links').addEventListener('click',function(e){
// this.style.backgroundColor=randomColor();
// console.log("Container",e.target);
// //alert("Eventbubbled");
// });

// document.querySelector('.nav').addEventListener('click',function(e){
// this.style.backgroundColor=randomColor();
// console.log("NAV",e.target);

// });

