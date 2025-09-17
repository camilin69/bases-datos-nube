# Mini app funcional simple conectada a Firebase con autenticación y reglas de seguridad básicas.

## Objetivo de la sesión
Que el estudiante comprenda y experimente la implementación de una base de datos en la nube mediante Firebase, aplicando reglas de seguridad básicas y construyendo una aplicación simple con autenticación y CRUD.

## Competencias a desarrollar

### Técnicas:
- Conectar una aplicación cliente con Firebase (Firestore + Authentication).
- Implementar operaciones CRUD sobre colecciones/documentos.
- Configurar reglas de seguridad en Firestore para restringir acceso a datos.
### Analíticas:
- Comparar Firebase y DynamoDB en términos de modelo, escalabilidad y seguridad.
- Identificar escenarios donde conviene usar una base de datos en la nube.
### Colaborativas:
- Trabajo en equipo para diseñar, probar y documentar una mini aplicación funcional.

## Introducción, contexto y comparación entre Firebase y DynamoDB

### Introducción
“Hoy vamos a comparar dos de las bases de datos serverless más usadas: Firebase (de Google) y DynamoDB (de AWS). Ambas eliminan la necesidad de administrar servidores, pero tienen diferencias importantes en modelo, escalabilidad y seguridad”.

### Modelo de datos

**Firebase Firestore**

Usa una estructura jerárquica a modo de documentos y colecciones.
Colecciones → Documentos → Campos/Subcolecciones.
Cada documento se guarda en formato tipo JSON.

Ejemplo:
```json
usuarios (colección)
  └── usuario123 (documento)
        ├── nombre: "Ana"
        ├── rol: "estudiante"
        └── tareas (subcolección)
             └── tarea1: { titulo: "Leer artículo", estado: "pendiente" }
```

**DynamoDB**
Usa una estructura a modo de Modelo clave-valor + documentos.
Cada ítem requiere Partition Key y opcionalmente Sort Key.
Permite valores anidados tipo JSON.

Ejemplo:
```json
{
  "UserId": "usuario123",
  "Nombre": "Ana",
  "Rol": "estudiante",
  "Tareas": [
    { "Titulo": "Leer artículo", "Estado": "pendiente" }
  ]
}
```

### Escalabilidad

**Firebase Firestore**

Escalabilidad automática, pero optimizada para apps con lecturas/escrituras rápidas y sincronización en tiempo real.

<u>Casos típicos:</u> chat en vivo, apps móviles con sincronización offline.

**DynamoDB**

También serverless, pero con control sobre throughput (lecturas/escrituras por segundo).

Escala a millones de operaciones, usado en aplicaciones globales de AWS (ej. Amazon Prime Day).

<u>Casos típicos:</u> e-commerce masivo, IoT a gran escala.

**Comparación:** Firebase escala de manera “invisible” al desarrollador. DynamoDB da más control pero requiere pensar bien en las claves de partición y patrones de acceso.

### Seguridad

**<u>Firebase:</u>**

Usa Firebase Security Rules (lenguaje declarativo).

Ejemplo:
```json
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

En el ejemplo, solo el usuario autenticado puede leer/escribir su propio documento.

**Ventaja:** muy fácil para apps móviles.

**<u>DynamoDB:</u>**
Usa IAM Roles & Policies de AWS.

Ejemplo de política:
```json
{
  "Effect": "Allow",
  "Action": ["dynamodb:PutItem","dynamodb:GetItem"],
  "Resource": "arn:aws:dynamodb:us-east-1:123456789012:table/Usuarios"
}
```
**Ventaja:** integración con todo el ecosistema AWS y control granular.

## sintesis de diferencias clave
| Característica       | Firebase Firestore                     | DynamoDB                             |
|----------------------|---------------------------------------|-------------------------------------|
| Modelo de datos      | Documentos y colecciones (JSON)       | Clave-valor + documentos (JSON)     |
| Escalabilidad        | Automática, optimizada para apps móviles | Control de throughput, escala masiva |
| Seguridad            | Reglas declarativas (Security Rules)  | IAM Roles & Policies                  |
| Casos de uso típicos | Apps móviles, chat en vivo            | E-commerce masivo, IoT a gran escala |
| Facilidad de uso     | Muy fácil para desarrolladores móviles | Requiere conocimiento de AWS         |


## Taller grupal (80 min)

### Reto grupal: 
Construir una mini app de notas personales o lista de tareas que cumpla con:

- Login básico con Firebase Authentication (correo y contraseña o Google).
- Colección “notas/tareas” donde cada documento esté vinculado al usuario logueado.
- CRUD completo: crear, leer, actualizar, eliminar.
- Reglas de seguridad: cada usuario solo puede acceder a sus documentos (request.auth.uid == resource.data.userId).
- Prueba colaborativa: un integrante crea datos, otro intenta acceder desde otra cuenta → validar que las reglas funcionen.

### Instrucciones generales para los estudiantes

- Formar grupos de 3 – 4 estudiantes.
- Configurar un proyecto nuevo en Firebase Console → habilitar Firestore y Authentication.
- Crear una app (puede ser web con HTML+JS, React o Flutter).
- Implementar login + CRUD de notas/tareas.
- Configurar reglas de seguridad y validarlas.
- Subir el resultado a GitHub o compartir link de Firebase Hosting (si lo desean).

### Guía de investigación

- Revisar la documentación oficial de Firebase Firestore y Authentication.
- Investigar reglas de seguridad comunes (allow read, write: if request.auth != null).
- Buscar ejemplos de Firebase To-Do List apps (repos en GitHub).

## Producto final esperado

Una mini app funcional con
- Login.
- CRUD de notas/tareas.
- Reglas de seguridad implementadas y validadas.
- Evidencia: repositorio, capturas o video corto del funcionamiento.

## Criterios de evaluación

- Funcionalidad básica (40%): login + CRUD completo.
- Seguridad (40%): reglas correctamente aplicadas.
- Presentación del resultado (20%): claridad del código, calidad del demo y documentación breve.

## Recursos recomendados
- [Documentación oficial de Firebase](https://firebase.google.com/docs)
- [Tutorial](https://firebase.google.com/docs/firestore/quickstart)
- [Tutorial de reglas de seguridad](https://firebase.google.com/docs/rules)

## Documentación Breve

* Herramientas usadas: Firebase Firestore, Firebase Authentication, React, TailwindCSS, vite, typescript + SWC
* Librerías: firebase, react-firebase-hooks, tailwindcss, typescript, react, dotenv, react-router-dom
* Utilicé .env para asegurarme de no exponer información sensible como claves de API o credenciales de autenticación.