# ============================================
# Stage 1: Build & Publish .NET 10 API
# ============================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["backend/LionGroup.API/LionGroup.API.csproj", "backend/LionGroup.API/"]
RUN dotnet restore "backend/LionGroup.API/LionGroup.API.csproj"

# Copy all source files
COPY backend/LionGroup.API/ backend/LionGroup.API/

# Build and publish
WORKDIR /src/backend/LionGroup.API
RUN dotnet publish -c Release -o /app/publish --no-restore

# ============================================
# Stage 2: Production Runtime
# ============================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

RUN mkdir -p /app/wwwroot/uploads

COPY --from=build /app/publish .

# Render exposes PORT env var or defaults to 8080
EXPOSE 8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "LionGroup.API.dll"]
