# Step 1: Base image
FROM node:18

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files
COPY package*.json ./

# Step 4: Clear cache and remove old files
RUN rm -rf node_modules package-lock.json
RUN npm cache clean --force

# Step 5: Install dependencies
RUN npm install --production --legacy-peer-deps --no-optional

# Step 6: Copy application files
COPY . .

# Step 7: Rebuild and install additional dependencies
RUN npm rebuild
RUN npm install rollup --save-dev

# Step 8: Build the application
RUN npm run build


# Step 9: Expose SSR port
EXPOSE 4000

# Step 10: Start SSR server
CMD ["npm", "run", "serve:ssr:frontend"]
