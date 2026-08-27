const fs = require('fs');
let code = fs.readFileSync('src/components/AIChatbot.tsx', 'utf8');

const target = `const data = await res.json();
        setMessages((prev) => [`;
        
const replacement = `const data = await res.json();

        if (data.action && onAction) {
          onAction(data.action);
        }

        setMessages((prev) => [`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/AIChatbot.tsx', code);
