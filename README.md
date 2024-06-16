# Creatim FrontEnd Assignment

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://danilojezernik.com/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/danilojezernik/)
[![instagram](https://img.shields.io/badge/instagram-red?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/danilojezernik)

This is example application of my assignment for Creatim.

Website url: [Creatim assignment](http://creatim.danilojezernik.com/)

Application is about showing Yoda, Darth Vader and Obi-Wan Kenobi Star Wars characters and their respective details.
The application utilizes the Star Wars API (https://swapi.dev/) to dynamically fetch and display data about these iconic characters. 
Data retrieval is optimized using localStorage to store information locally. 
Additionally, the application features sound effects triggered when users interact with the Jedi names or encounter data discrepancies.

- [Angular v16](https://v16.angular.io/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Howler.js](https://howlerjs.com/)
- [101SoundBoards.com](https://101soundboards.com)

# Starting aplication

Install node modules
```bash
npm install
```

Run command:

```bash
ng serve
```

## Extras

### Mobile responsive

I leverage Tailwind CSS to ensure responsiveness across mobile devices. This is achieved through Tailwind's utility-first approach, which avoids traditional @media breakpoints:

```css

/* Adjust font size for different screen sizes */
@media (max-width: 575px) {
  /* XS */
}

@media (min-width: 576px) and (max-width: 767px) {
  /* S */
}

@media (min-width: 768px) and (max-width: 991px) {
  /* M */
}

@media (min-width: 992px) and (max-width: 1199px) {
  /* L */
}

@media (min-width: 1200px) and (max-width: 1399px) {
  /* XL */
}

@media (min-width: 1400px) {
  /* XXL */
}

```

### Local Storage

Local Storage is used to store and retrieve data within the browser, offering a capacity of 5-10 MB per domain. For larger storage needs, IndexedDB is a more suitable option, allowing storage up to 50 MB and beyond, depending on the browser and available disk space.

### Sound

I use howler.js audio library for playing sound. When a user changes the name of a Jedi, a sound is played. Additionally, if no data is available, a sound is played along with an image of Darth Vader.

## 🛠 Skills for this frontend projects

This frontend project showcases proficiency in Angular for building dynamic web applications, as well as expertise in leveraging Tailwind CSS for efficient and responsive design implementations.
