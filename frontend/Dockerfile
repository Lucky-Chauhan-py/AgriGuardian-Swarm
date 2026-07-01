FROM node:18-alpine

WORKDIR /app

# Copy package.json and install
COPY package.json .
RUN npm install

# Copy application code
COPY . .

# Build next application
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
