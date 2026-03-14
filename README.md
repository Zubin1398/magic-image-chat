<div align="center">
<img width="1200" height="475" alt="Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Magic Image & Chat

Веб-приложение с AI-функциями для редактирования изображений и общения.

## Возможности

1. **Image Editor** — редактирование изображений с помощью AI. Загрузите изображение, введите текстовую инструкцию, и AI создаст отредактированную версию.
2. **AI Assistant** — чат-бот для ответов на вопросы о редактировании изображений или общих темах.

### Технологии

| Категория | Технологии |
|-----------|------------|
| **Фреймворк** | React 19 |
| **Язык** | TypeScript 5.8 |
| **Сборка** | Vite 6.2 |
| **Стили** | Tailwind CSS 4.1 |
| **AI** | Google GenAI SDK (`@google/genai`) |
| **Анимации** | Motion (`motion/react`) |
| **Иконки** | Lucide React |
| **Markdown** | React Markdown |

### Архитектура

```
src/
├── main.tsx              # Точка входа
├── App.tsx               # Корневой компонент с навигацией по табам
├── index.css             # Глобальные стили (Tailwind)
└── components/
    ├── ImageEditor.tsx   # Компонент редактирования изображений
    └── Chatbot.tsx       # Компонент AI-чата
```

**Ключевые файлы конфигурации:**
- `vite.config.ts` — настройка Vite, плагины React и Tailwind, алиас `@/*`
- `tsconfig.json` — TypeScript, JSX, moduleResolution: bundler
- `package.json` — зависимости и скрипты

---

## Запуск

### Предварительные требования

- Node.js 18+
- API-ключ Gemini (получить в [Google AI Studio](https://ai.studio/))

### Установка

1. Установите зависимости:
   ```bash
   npm install
   ```

2. Создайте файл `.env.local` и добавьте ваш API ключ:
   ```
   GEMINI_API_KEY=ваш_ключ
   ```

3. Запустите приложение:
   ```bash
   npm run dev
   ```

Приложение будет доступно по адресу: http://localhost:3000

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера (порт 3000) |
| `npm run build` | Сборка для продакшена |
| `npm run preview` | Предпросмотр собранной версии |
| `npm run lint` | Проверка TypeScript |
| `npm run clean` | Удаление папки `dist` |
