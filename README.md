# 2025 F5 Intern Showcase
Team: John David White, Nutsa Bidzishvili, Mohamad Aldawamneh

## Office Events Planning App
The purpose of this project is to make it ridiculously easy for F5/NGINX employees to organise events. We aim to planning of events such as:
- Where to go for lunch
- Organising places to eat for company dinners
- and more!

## Prerequisites
- NodeJS
- Vite + React
- Golang 1.24.x

## How to Launch
- Once you have installed the prerequisites, run `make install-deps` to install the dependencies
- Once dependencies are installed, in 3 separate terminals run: `make dev`, `make run` and `make serve` respectively
  - In the future we plan to containerise and deploy the application using docker to avoid having to run 3 separate command for the full stack application

## Tech Stack
This project is a full stack web app. Our tech stack consists of the following:
- Frontend: React + Vite with NodeJS
  - React allows us to simplify frontend development by creating TypeScript components that need not be repeated across multiple different pages
  - Languages Include: TypesScript, HTML, CSS, JavaScript
- Backend: Go/Python
  - We have chosen to use Go/Golang because it is the language that we have been learning as part of our internship, and is effective at creating web apps, especially those using a microservices architecture like we are
  - Python was used as an intermediary server between the Go backend and React frontend to handle user sessions full stack.
- Database: SQLite
  - While SQLite is not the most scalable database, it is free-to-use and will work fine for what we invision for our project

### Our Roles
- John David: Backend developer and Database Architect
- Nutsa: Frontend developer
- Mohamad: Wheel
