#all career data

ac <- read.csv("/Users/Shane/Documents/SugarSync/career-buddy/data-manipulation/careers_maroon.csv")

#descriptive statistics
ac[0,]
density(ac$career_med_ann_wage)
hist(ac$career_num_emp_change)
hist(ac$career_percent_emp_change)
hist(ac$career_job_openings)


#select all continuous variables
ac <- as.data.frame(ac)
c <- ac[,c('career_med_ann_wage', 'career_num_emp_change', 'career_percent_emp_change', 'career_job_openings')]
ac$career_job_openings[1:10]


#problems 
#- analyze only certain columns in data, and eliminate rows with NA, but after clustering is done add
# a new column to the original csv file containing the cluster number each row belongs to
# with the rows matching up 
c[is.na(c),]

#cleaned career data with all rows with 'NA' removed
# cc <- c[complete.cases(c),]
cc <- na.omit(c)
#reassign row numbers to avoid confusion caused by missing rows
rownames(cc) <- 1:nrow(cc)

#generate SSE scree plot to determine number of k-means clusters: http://stackoverflow.com/questions/15376075/cluster-analysis-in-r-determine-the-optimal-number-of-clusters
wssplot <- function(data) {
  wss <- (nrow(data)-1)*sum(apply(data,2,var))
  max_cluster <- (nrow(data) - 1)
  for (i in 2:max_cluster) 
    wss[i] <- sum(kmeans(data, centers=i, nstart=25)$withinss)
  
    plot(1:max_cluster, wss, type="b", xlab="Number of Clusters",
       ylab="Within groups sum of squares")
}

wssplot(dfc)
#4 appears to be optimal 

# K-Means Cluster Analysis
fit <- kmeans(cc, 6) # 6 cluster solution
# get cluster means 
# aggregate(cc,by=list(fit$cluster),FUN=mean)
# append cluster assignment
# cc <- data.frame(cc, fit$cluster)

#plot results
plot(cc$height, dfc$salary, type="p", xlab = "height", ylab="salary", col=dfc$color)

