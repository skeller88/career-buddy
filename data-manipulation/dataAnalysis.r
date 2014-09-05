#questions
#why does cc have strange row numbers

#all career data

ac <- read.csv("/Users/Shane/Documents/SugarSync/career-buddy/data-manipulation/careers_maroon.csv")

#descriptive statistics - uncomment when needed
##density(ac$career_med_ann_wage)
##hist(ac$career_num_emp_change)
##hist(ac$career_percent_emp_change)
##hist(ac$career_job_openings)

#explore categorical variables - uncomment when needed
#good candidate for refactor to dummy binary variables 
##summary(ac$career_edu)
#has 707 None classifications; too many to be useful 
##summary(ac$career_work_exp)
#job training has many jobs classified as "None" which should not be. For example, software engineers get on the job training. 
##summary(ac$career_job_training)

#which rows have NA values in any column? How many?
##for(n in 1:ncol(ac))
##  print(length(which(is.na(ac[,n]))))
#career_percent_self_emp has 219 NA values, so won't use that variable

#remove duplicate 'Cashier' career row. Eliminated row with code 41-2011 and kept row with code 41-2010.
#difference between rows is number of employeed in 2012 and 2022. 41-2010 has higher numbers by ~20K 
ac <- ac[-which(ac$career_name == 'Cashiers')[2],]

#remove all occupations with code ending in '0' because they are aggregates of other occupations, and will skew the cluster analysis
ac <- ac[!grepl("0$", ac$career_occ_code),]

#remove 5 rows with NA values for 'career_med_ann_wage', because they cannot be charted. All entertainment professions such as 'Dancers' and 'Actors'
#is.na() generates a logical vector, not indexes. so "-" doesn't work. 
ac <- ac[!is.na(ac$career_med_ann_wage),]

#select all continuous variables except for 'career_percent_self_emp', which has too many rows with an NA value
#"cc" stands for "careers with continuous variables"
#*variables - silhouette score
#job openings - .55
#num change - .46
#percent change - .38
#percent change, job openings - .31
#percent change, num change, job openings - .3
cc <- ac[,c('career_med_ann_wage', 'career_job_openings')]
row.names(cc) <- ac$career_name
  
#analyze only certain columns in data, and eliminate rows with NA, but after clustering is done add
#a new column to the original csv file containing the cluster number each row belongs to
#with the rows matching up 

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
fit <- kmeans(cc_scaled, 3) # 6 cluster solution
cluster <- fit$cluster
# get cluster means 
#aggregate(cc_scaled,by=list(fit$cluster),FUN=mean)
#ac <- cbind(ac, cluster)

#examine clusters. Note that cluster assignments will not be in the same order each time clustering is run. 
cc_mean <- aggregate(cc, by=list(fit$cluster), FUN="mean")

#cluster 1 - not a standout in any category - increasing the least of the careers with positive growth, 3rd most job openings, 3rd highest wages 
#cluster 2- highest paying
#cluster 3- worst career choices - largest decrease in employment and lowest wage 
#cluster 4- 2nd highest total amount of job openings and change in number of people employed 
#cluster 5- highest total amount of job openings and change in number of people employed
#cluster 6- fastest growing, 2nd highest paying 

#plot results
colors <- c('green', 'purple', 'blue', 'orange', 'yellow')
plot(ac$career_job_openings, ac$career_med_ann_wage, type="p", xlab = "job openings", ylab="wage", col=colors[cluster])
plot(ac$career_num_emp_change, ac$career_med_ann_wage, type="p", xlab = "number of jobs added/lost", ylab="wage", col=colors[cluster])
plot(ac$career_percent_emp_change, ac$career_med_ann_wage, type="p", xlab = "percent change in number of jobs", ylab="wage", col=colors[cluster])

cc_mean
#Group.1 career_med_ann_wage career_job_openings
#1       1            38514.61            38.89099
#2       2            86334.89            35.51978
#3       3            33208.89           693.12593

#compute silhouettes 
library(cluster)
#dissimilarity matrix
dissE <- daisy(cc_scaled)
sk <- silhouette(fit$cluster, dissE)
plot(sk)

#pam
library(fpc)
pamk.best <- pamk(cc_scaled)
plot(pam(cc_scaled, pamk.best$nc))
