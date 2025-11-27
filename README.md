useCaseDiagram
    actor "Dueño Certificadora" as Admin
    package "Sistema Web (Backoffice)" {
        usecase "Iniciar Sesión Segura" as UC1
        usecase "Visualizar Radar de Negocio" as UC2
        usecase "Gestionar Clientes y Edificios" as UC3
        usecase "Registrar Nuevos Activos" as UC4
        usecase "Comprar Créditos" as UC5
    }
    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    UC3 ..> UC4 : <<include>>