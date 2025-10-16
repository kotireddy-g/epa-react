cat > src/vite-env.d.ts << 'EOF'
/// <reference types="vite/client" />

// Declare CSS module types
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}
EOF