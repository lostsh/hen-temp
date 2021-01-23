'''
for j in range(0, 500, 50):
	print("<text x=\"0\" y=\""+str(500-(j+5))+"\" font-family=\"Verdana\" font-size=\"12\" fill=\"black\">"+str((j*100)/500)+"</text>")
	print("<path d=\"M0,"+str(500-j)+" ",end='')
	for i in range(0, 500, 11):
		print("L"+str(i+10)+","+str(500-j)+" M"+str(i+10+1)+","+str(500-j)+" ", end='')
	print("\" stroke=\"black\" stroke-width=\"1\"/>")
'''

tMax = 50

for j in range(0, 500, 25):
	if(j%2 == 0):
		print("<text x=\"0\" y=\""+str(500-(j+2))+"\" font-family=\"Verdana\" font-size=\"12\" fill=\"black\">"+str((((j*100)/500)*tMax)/100)+"</text>")
		print("<path d=\"M0,"+str(500-j)+" ",end='')
	else:
		print("<path opacity=\"0.5\" d=\"M0,"+str(500-j)+" ",end='')

	for i in range(0, 500, 11):
		print("L"+str(i+10)+","+str(500-j)+" M"+str(i+10+1)+","+str(500-j)+" ", end='')
	print("\" stroke=\"black\" stroke-width=\"1\"/>")
