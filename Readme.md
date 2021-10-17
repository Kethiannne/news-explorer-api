# KethNews Explorer API

### Overview

The API of "KethNews Explorer" with authorization and registration handled by my back-end server.

This repository contains the full API of "KethNews Explorer" project that features user authorization and user registration and handles cards and users.

A link to the repository with the complete React application which uses this API;

https://github.com/Kethiannne/news-explorer-frontend

A link to the website that hosts this API.

https://kethianne-news.students.nomoreparties.site

### Functionality & Technologies
  - Express handles server functionality
  - This API uses a Mongo DB to handle user and card storage.
  - Helmet provides additional security.
  - CORS protection allows access only from selected routes
  - Rate Limiting prevents standard DDOS attacks
  - Celebrate & Joi allow for validation of information before checks are made internally to smooth performance.
  - Central Error handling pulls errors from accross the app into one place for easier maintenance.
  - Winston is used to provide error and request logging for easier maintenance
