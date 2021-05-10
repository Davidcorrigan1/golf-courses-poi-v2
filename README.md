
<p align="center">
  <h3 align="center">Golf Course of Ireland Readme</h3>

  <p align="center">
  

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This site was developed as a POI web application for Golf Courses of Ireland. Users can use the app to add details of course courses
to the Database along with the coordinates of the course and some images.


Here are the main features:
* Authentication of users. 
    * A user can be a normal user who can add/update/delete course data
    * Or a Admin user who has addition functionality around user admin and statistics. An admin user can see all normal user details and update and delete them.
    They can check a users login count and last date of login. They also see stats on the number of POI golf courses added to the system.
* Authenticated users can add new course details, name description and coordinates.
* Authenticated users can update and delete course details
* They can add/delete images to/from the course listing.
* They can add new categories and update categories
* Courses can be filtered by category at the click of a button.
* On the edit course page the current course weather will also be displayed.

### Built With

This section lists major platforms, frameworks and technologies that were used to build the project using. 
* [Bootstrap](https://getbootstrap.com)
* [Node.js](https://nodejs.org)
* [hapi](https://hapi.dev/)
* [Handlebars](https://handlebarsjs.com/)* [Mongoose](https://mongoosejs.com/)
* [uikit](https://getuikit.com/)




<!-- GETTING STARTED -->
## Getting Started


To get a local copy up and running follow these simple example steps.

1. An .env file will need the following entries
    * name=cloudinary User Name
    * key=Cloudinary Key
    * secret=Cloudinary Secret Key
    * cookie_name=golfPOI-web
    * cookie_password=a password
    * db=mongodb://localhost/golfCoursePOI
    * api_key=open weather api key
    
### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Details to be added
2. Clone the repo
   ```sh
   git clone https://github.com/Davidcorrigan1/golf-courses-poi.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the WIT License. 


<!-- CONTACT -->
## Contact



Project Link: [https://github.com/davidcorrigan1/golf-courses-poi](https://github.com/davidcorrigan1/golf-courses-poi
)



