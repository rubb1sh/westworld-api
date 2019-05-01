read -p "Enter the model name : " model
model=${model,,}
model=${model^}
cat << EOF > src/models/$model.ts
export interface $model {
    // Add members here...
}
EOF
