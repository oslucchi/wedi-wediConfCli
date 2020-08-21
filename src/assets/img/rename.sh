for file in `ls 0*`
do
	#art=`echo $file | cut -d ' ' -f 1`
	# art=${str%% }
	echo $file | cut -d ' ' -f 1
	# echo $art
done
