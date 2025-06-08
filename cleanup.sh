# Run this script from the root of your project to clean up unused files and rename new.html to index.html

# Remove unused files (examples, adapt as needed)
rm -f /Users/stenhougaard/Documents/GitHub/generativeAI/new.html
rm -f /Users/stenhougaard/Documents/GitHub/generativeAI/prompts/*.html
rm -f /Users/stenhougaard/Documents/GitHub/generativeAI/services/*.html

# Rename new.html to index.html if not already done
if [ -f /Users/stenhougaard/Documents/GitHub/generativeAI/new.html ]; then
  mv /Users/stenhougaard/Documents/GitHub/generativeAI/new.html /Users/stenhougaard/Documents/GitHub/generativeAI/index.html
fi

# To make the script executable, run this command in your terminal:
chmod +x /Users/stenhougaard/Documents/GitHub/generativeAI/cleanup.sh

# Then you can run it with:
# ./cleanup.sh
