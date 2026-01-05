import requests
import json
import os
import time
from datetime import datetime

# CONFIGURAÇÃO
WEBHOOK_URL = "https://trae4rlyhrxi.vercel.app/api/webhook"
ARQUIVO_JSON = "maker_opportunities.json"  # Nome do arquivo que contém os dados

def ler_e_enviar():
    # 1. Verifica se arquivo existe
    if not os.path.exists(ARQUIVO_JSON):
        print(f"❌ Arquivo '{ARQUIVO_JSON}' não encontrado nesta pasta.")
        print(f"Certifique-se de que o arquivo está em: {os.getcwd()}")
        return

    try:
        # 2. Lê o arquivo JSON
        print(f"📂 Lendo {ARQUIVO_JSON}...")
        with open(ARQUIVO_JSON, 'r', encoding='utf-8') as f:
            conteudo = json.load(f)

        # 3. Tenta encontrar a lista de oportunidades
        oportunidades = []
        
        # Caso 1: O JSON já é uma lista direta
        if isinstance(conteudo, list):
            oportunidades = conteudo
            
        # Caso 2: O JSON é um dicionário e a lista está dentro de uma chave
        elif isinstance(conteudo, dict):
            # Lista de chaves prováveis onde os dados podem estar
            chaves_possiveis = [
                'top_10_melhores_maker_opportunities', 
                'opportunities', 
                'oportunidades', 
                'data', 
                'itens'
            ]
            
            for chave in chaves_possiveis:
                if chave in conteudo and isinstance(conteudo[chave], list):
                    oportunidades = conteudo[chave]
                    print(f"✅ Encontrado {len(oportunidades)} itens na chave '{chave}'.")
                    break
            
            # Se ainda não achou, tenta pegar valores se for um dicionário de exchanges (ex: formato antigo)
            if not oportunidades:
                print("⚠️ Estrutura do JSON não reconhecida automaticamente. Tentando enviar como lista única se possível...")
                # Se não achou lista, talvez o próprio dict seja um item? (improvável para 'todas as oportunidades')

        if not oportunidades:
            print("❌ Não foi possível encontrar uma lista de oportunidades válida no JSON.")
            return

        # 4. Monta o Payload para o Webhook
        payload = {
            "timestamp_gerado": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "total_oportunidades_analisadas": len(oportunidades),
            "top_10_melhores_maker_opportunities": oportunidades  # Envia TUDO (o nome da chave é só convenção)
        }

        # 5. Envia
        print(f"🚀 Enviando {len(oportunidades)} oportunidades para o site...")
        response = requests.post(WEBHOOK_URL, json=payload)

        if response.status_code == 200:
            print("✅ SUCESSO! Dados enviados e site atualizado.")
            # Opcional: Imprimir resposta do servidor
            print(f"Resposta do Servidor: {response.text}")
        else:
            print(f"❌ Erro {response.status_code}: {response.text}")

    except json.JSONDecodeError:
        print("❌ Erro: O arquivo não é um JSON válido.")
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")

if __name__ == "__main__":
    # Loop para rodar a cada X segundos ou apenas uma vez
    # Para rodar uma vez e sair:
    ler_e_enviar()
    
    # Se quiser deixar rodando em loop (comente as linhas acima e descomente abaixo):
    # while True:
    #     ler_e_enviar()
    #     print("Aguardando 30 segundos...")
    #     time.sleep(30)
