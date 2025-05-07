# Todo Checklist App

A clean architecture React Native application for managing todos with completion status tracking.

![Todo App Screenshot](./assets/screenshots/todo-app.png)

## Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Visual indicators for todo completion status
- ✅ Swipe to delete functionality
- ✅ Modern, responsive UI with React Native Paper
- ✅ Clean architecture implementation

## Architecture

This project follows Clean Architecture principles, with clear separation of concerns:

### Layers

1. **Domain Layer**
   - Business logic and entities
   - Use cases that orchestrate data flow
   - No dependencies on other layers or external frameworks

2. **Data Layer**
   - Repositories that implement domain interfaces
   - Data sources that interact with external APIs
   - Data mapping between domain entities and external models

3. **Presentation Layer**
   - UI components and screens
   - State management through React Context
   - Event handling and user interactions

## Project Structure

```
r_todo_template/
├── domain/
│   ├── entities/          # Business models
│   │   └── Todo.js
│   └── usecases/          # Business logic
│       └── TodoUseCases.js
├── data/
│   ├── datasources/       # External data access
│   │   └── TodoService.js
│   └── repositories/      # Repository implementations
│       └── TodoRepository.js
├── presentation/
│   ├── context/           # State management
│   │   └── TodoProvider.jsx
│   └── pages/             # UI screens
│       └── TodoList.jsx
├── assets/                # Images, fonts, etc.
├── App.js                 # Entry point
└── index.js               # Expo registration
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd r_todo_template
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the app:
```bash
npm start
# or
yarn start
```

## Technologies Used

- **React Native** - Mobile app framework
- **React Native Paper** - Material Design component library
- **React Native Gesture Handler** - Touch gesture system
- **React Native Reanimated** - Animation library
- **React Context API** - State management
- **Expo** - Development platform

## Usage

- **Add a task**: Tap the + button and enter task details
- **Edit a task**: Tap the Edit button on any todo item
- **Complete a task**: Tap the checkbox next to any item
- **Delete a task**: Swipe left on any todo item

## API Integration

The app connects to a REST API for persisting todos. The API endpoints include:

- GET `/todos` - Fetch all todos
- POST `/todos` - Create a new todo
- PUT `/todos/:id` - Update a todo
- DELETE `/todos/:id` - Delete a todo

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
