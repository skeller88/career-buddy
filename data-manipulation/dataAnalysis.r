#questions
#why does cc have strange row numbers

#all career data

ac <- read.csv("/Users/Shane/Documents/SugarSync/career-buddy/data-manipulation/careers_maroon.csv")

#descriptive statistics
ac[0,]
density(ac$career_med_ann_wage)
hist(ac$career_num_emp_change)
hist(ac$career_percent_emp_change)
hist(ac$career_job_openings)

#which rows have NA values in any column? How many?
for(n in 1:ncol(ac))
  print(length(which(is.na(ac[,n]))))
#career_percent_self_emp has 219 NA values, so won't use this variable

#explore categorical variables
#good candidate for refactor to dummy binary variables 
summary(ac$career_edu)

#has 707 None classifications; too many to be useful 
summary(ac$career_work_exp)

#job training has many jobs classified as "None" which should not be. For example, software engineers get on the job training. 
summary(ac$career_job_training)

#eliminate duplicate 'Cashier' career row. Eliminated row with code 41-2011 and kept row with code 41-2010.
#difference between rows is number of employeed in 2012 and 2022. 41-2010 has higher numbers by ~20K 
ac <- ac[-which(ac$career_name == 'Cashiers')[2],]

#eliminate 'Total, all occupations' because it will skew the clusters
ac <- ac[-which(ac$career_name == 'Total, all occupations'),]

#select all continuous variables
c <- ac[,c('career_2012_emp', 'career_2022_emp', 'career_num_emp_change', 'career_percent_emp_change', 'career_job_openings', 'career_med_ann_wage')]
row.names(c) <- ac$career_name
  
#analyze only certain columns in data, and eliminate rows with NA, but after clustering is done add
#a new column to the original csv file containing the cluster number each row belongs to
#with the rows matching up 

#cleaned career data with all rows with 'NA' removed
# cc <- c[complete.cases(c),]
cc <- na.omit(c)

#normalize variables
cc_scaled <- scale(cc)

#generate SSE scree plot to determine number of k-means clusters: http://stackoverflow.com/questions/15376075/cluster-analysis-in-r-determine-the-optimal-number-of-clusters
wssplot <- function(data) {
  wss <- (nrow(data)-1)*sum(apply(data,2,var))
  max_cluster <- 10
  for (i in 2:max_cluster) 
    wss[i] <- sum(kmeans(data, centers=i, nstart=25)$withinss)
    print(wss[i])
  
    plot(1:max_cluster, wss, type="b", xlab="Number of Clusters",
       ylab="Within groups sum of squares")
}

wssplot(cc_scaled)
#6 appears to be optimal 

# K-Means Cluster Analysis
fit <- kmeans(cc_scaled, 6) # 6 cluster solution
# get cluster means 
#aggregate(cc_scaled,by=list(fit$cluster),FUN=mean)
# append cluster assignment
cluster <- fit$cluster
cc <- cbind(cc, cluster)
cc <- cc[order(cc$cluster),]
cc[1:500,]

#examine clusters. Note that cluster assignments will not be in the same order each time clustering is run. 
aggregate(cc, by=list(cc$cluster), mean)

#cluster 1 - fast growing, 2nd highest paying 
#cluster 2- highest paying
#cluster 3- 2nd highest total amount of job openings and change in number of people employed
#cluster 4- highest total amount of job openings and change in number of people employed
#cluster 5- not a standout in any category - increasing the least of the careers with positive growth, 3rd most job openings, 3rd highest wages
#cluster 6- worst career choices - decrease in employment and lowest wage

#plot results
# plot(cc$height, dfc$salary, type="p", xlab = "height", ylab="salary", col=dfc$color)

#   Group.1 career_2012_emp career_2022_emp career_num_emp_change career_percent_emp_change career_job_openings career_med_ann_wage cluster
# 1       1        168.9911        212.5856             43.591096                 27.189041            74.84247            45461.85       1
# 2       2        172.3032        192.3729             20.063830                 11.273936            55.62287            89376.06       2
# 3       3       3347.6353       3755.5804            407.949020                 13.362745          1182.28824            38090.20       3
# 4       4       9857.8167      10897.7417           1039.916667                 11.975000          3663.34167            38871.67       4
# 5       5        255.7901        278.0748             22.281542                  8.686207            82.53387            39623.63       5
# 6       6        109.1610        100.9045             -8.254237                 -8.459887            24.33729            37021.58       6
