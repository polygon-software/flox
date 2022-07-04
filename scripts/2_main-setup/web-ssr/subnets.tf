// Subnets (public and private)
resource "aws_subnet" "frontend_public_subnet" {
  count                   = 3
  cidr_block              = cidrsubnet(var.cidr_block, 5, count.index + var.web_pub_subnet_factor)
  map_public_ip_on_launch = true
  vpc_id                  = var.vpc_id
  availability_zone       = var.azs[count.index]

  tags = {
    Name          = "${var.project}-${var.type}-web-public-subnet-${var.azs[count.index]}"
    SubnetType    = "public"
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_subnet" "frontend_private_subnet" {
  count = 3
  cidr_block              = cidrsubnet(var.cidr_block, 5, count.index + var.web_pri_subnet_factor + var.web_pub_subnet_factor)
  map_public_ip_on_launch = false
  vpc_id                  = var.vpc_id
  availability_zone       = var.azs[count.index]

  tags = {
    Name          = "${var.project}-${var.type}-web-private-subnet-${var.azs[count.index]}"
    SubnetType    = "private"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route_table_association" "frontend_route_table_association_public" {
  count                 = 3
  route_table_id        = aws_route_table.route_table_public.id
  subnet_id             = aws_subnet.frontend_public_subnet[count.index].id

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route_table_association" "frontend_route_table_association_private" {
  count                 = 3
  route_table_id        = aws_route_table.route_table_private.id
  subnet_id             = aws_subnet.frontend_private_subnet[count.index].id

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route" "frontend_route_private" {
  route_table_id        = aws_route_table.route_table_private.id
  destination_cidr_block= "0.0.0.0/0"
  nat_gateway_id        = aws_nat_gateway.frontend_nat.id
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route" "frontend_route_public" {
  route_table_id        = aws_route_table.route_table_public.id
  destination_cidr_block= "0.0.0.0/0"
  gateway_id            = var.internet_gateway_id
  lifecycle {
    create_before_destroy = true
  }
}

// TODO @Cloudmates: Is that needed?
resource "aws_nat_gateway" "frontend_nat" {
  allocation_id         = aws_eip.web_nat_elastic_ip.id
  subnet_id             = aws_subnet.frontend_public_subnet[0].id

  tags = {
    Name          = "${var.project}-${var.type}-web-nat"
    Project       = var.project
  }

  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_route_table" "route_table_private" {
  vpc_id                = var.vpc_id
  tags = {
    Name          = "${var.project}-${var.type}-web-route-table-private"
    Project       = var.project
    SubnetType    = "private"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route_table" "route_table_public" {
  vpc_id                = var.vpc_id

  tags = {
    Name          = "${var.project}-${var.type}-web-route-table-public"
    Project       = var.project
    SubnetType    = "public"
  }
}

// Create new elastic IP for the NAT
// TODO @Cloudmates: Is that needed?
resource "aws_eip" "web_nat_elastic_ip" {
  vpc                   = true
  tags = {
    Name          = "${var.project}-${var.type}-web-nat-eip"
    Project       = var.project
  }

  lifecycle {
    create_before_destroy = true
  }
}


